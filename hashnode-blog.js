const core = require("@actions/core");
const { request } = require("graphql-request");
const { Octokit } = require("octokit");
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
  const host = process.env.HOST;
  const pubID = process.env.PUBID;
  const pat = process.env.PAT;

  const pr = await fetchPR(owner, repo);
  const { title, body } = await fetchPRInfo(owner, repo, pr);
  const files = await fetchFiles(owner, repo, pr);
  const reviews = await fetchReviews(owner, repo, pr);
  const comments = await fetchComments(owner, repo, pr);
  const commits = await fetchCommits(owner, repo, pr);
  const summary =
    title +
    "\n" +
    body +
    "\n" +
    files +
    "\n" +
    reviews +
    "\n" +
    comments +
    "\n" +
    commits;

  const query = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        slug
        title
        tags {
        }
      }
    }
  }
 `;

  const input = {
    title: title,
    publicationId: pubID,
    contentMarkdown: "random content",
    tags: [
      {
        slug: title,
        name: title,
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
