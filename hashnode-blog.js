const core = require("@actions/core");
const { request } = require("graphql-request");
const { Octokit } = require("octokit");
const { CohereClient } = require("cohere-ai");

const octokit = new Octokit({});

async function fetchPR(owner, repo) {
  try {
    const { data } = await octokit.request(
      `GET /repos/${owner}/${repo}/pulls`,
      {
        sort: "updated",
        state: "closed",
        direction: "desc",
        per_page: 1,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.raw+json",
        },
      }
    );
    const latestPullRequest = data[0]["number"];
    return latestPullRequest;
  } catch (error) {
    console.error(error);
  }
}

async function fetchCommits(owner, repo, pr) {
  try {
    const { data } = await octokit.request(
      `GET /repos/${owner}/${repo}/pulls/${pr}/commits`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
        },
      }
    );
    let allCommits = "";

    for (let i = 0; i < data.length; i++) {
      allCommits += data[i]["commit"]["message"] + "\n";
    }
    return allCommits;
  } catch (error) {
    console.error(error);
  }
}

async function fetchFiles(owner, repo, pr) {
  try {
    const { data } = await octokit.request(
      `GET /repos/${owner}/${repo}/pulls/${pr}/files`,
      {
        per_page: 3,
        page: 1,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.text+json",
        },
      }
    );
    let allFiles = "";
    for (let i = 0; i < data.length; i++) {
      allFiles += data[i]["patch"] + "\n";
    }
    return allFiles;
  } catch (error) {
    console.error(error);
  }
}

async function fetchComments(owner, repo, pr) {
  try {
    const { data } = await octokit.request(
      `GET /repos/${owner}/${repo}/issues/${pr}/comments`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.text+json",
        },
      }
    );
    let allComments = "";
    for (let i = 0; i < data.length; i++) {
      allComments += data[i]["body_text"] + "\n";
    }
    return allComments;
  } catch (error) {
    console.error(error);
  }
}

async function fetchReviews(owner, repo, pr) {
  try {
    const { data } = await octokit.request(
      `GET /repos/${owner}/${repo}/pulls/${pr}/comments`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.text+json",
        },
      }
    );
    let allReviews = "";
    for (let i = 0; i < data.length; i++) {
      allReviews += data[i]["body"] + "\n" + data[i]["diff_hunk"] + "\n";
    }
    return allReviews;
  } catch (error) {
    console.error(error);
  }
}

async function fetchPRInfo(owner, repo, pr) {
  try {
    const { data } = await octokit.request(
      `GET /repos/${owner}/${repo}/pulls/${pr}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.text+json",
        },
      }
    );
    const title = data["title"];
    const body = data["body"];
    return { title, body };
  } catch (error) {
    console.error(error);
  }
}

async function run() {
  const owner = process.env.OWNER;
  const repo = process.env.REPO;
  const pubID = process.env.PUBID;
  const pat = process.env.PAT;
  const co = process.env.COHERE;

  const pr = await fetchPR(owner, repo);
  const { title, body } = await fetchPRInfo(owner, repo, pr);
  const files = await fetchFiles(owner, repo, pr);
  const reviews = await fetchReviews(owner, repo, pr);
  const comments = await fetchComments(owner, repo, pr);
  const commits = await fetchCommits(owner, repo, pr);

  const cohere = new CohereClient({
    token: co, // This is your trial API key
  });

  const generatedText = async () => {
    const response = await cohere.generate({
      model: "command",
      prompt: `I will provide you details of a pull request, including some of the files, review comments, and information. I want you to generate a blog post about it in markdown format. The details of the pull request are as follows: ${body}. Some of the files which have been changed ${files}. Any of the reviews ${reviews}. Any of the comments ${comments}. The commit messages ${commits}.`,
      maxTokens: 300,
      temperature: 0.3,
      k: 0,
      stopSequences: [],
      returnLikelihoods: "NONE",
    });
    return `${response.generations[0].text}`;
  };
  const content = await generatedText();

  const query = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          slug
          title
        }
      }
    }
   `;

  const input = {
    title: title,
    publicationId: pubID,
    contentMarkdown: content,
    tags: [
      {
        slug: title + "-pr",
        name: title + "-pr",
      },
    ],
  };

  const headers = {
    Authorization: pat,
  };

  request("https://gql.hashnode.com", query, { input }, headers)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}

run().catch((error) => core.setFailed(error.message));
