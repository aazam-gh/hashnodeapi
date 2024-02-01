const { Octokit } = require("octokit");
const octokit = new Octokit({});

async function fetchPR(owner, repo) {
  try {
    const { data } = await octokit.request(`GET /repos/${owner}/${repo}/pulls`, {
      sort: "updated",
      state: "closed",
      direction: "desc",
      per_page: 1,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github.raw+json",
      },
    });
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
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]["commit"]["message"]);
    }
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
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]["patch"]);
    }
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
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]["body_text"]);
    }
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
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]["body"]);
      console.log(data[i]["diff_hunk"]);
    }
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
    console.log(data["title"]);
    console.log(data["body"]);
  } catch (error) {
    console.error(error);
  }
}


async function main(owner, repo) {
    const pr = await fetchPR(owner, repo);
    await fetchPRInfo(owner, repo, pr);
    await fetchFiles(owner, repo, pr);
    await fetchReviews(owner, repo, pr);
    await fetchComments(owner, repo, pr);
    await fetchCommits(owner, repo, pr);
  }

module.exports = {
  main
};