const core = require('@actions/core');
const { request } = require('graphql-request');
const { main } = require('./github-api')
const { Octokit } = require("octokit");
const octokit = new Octokit({});


async function run() {
 const host = core.getInput('host');
 const owner = core.getInput('OWNER');
 const repo = core.getInput('REPO');

 await main(owner, repo);


 const query = `
 query Publication($host: String!) {
    publication(host: $host) {
      isTeam
      title
      posts(first: 10) {
        edges {
          node {
            title
            brief
            url
          }
        }
      }
    }
 }
 `;

 const variables = { host };

 request('https://gql.hashnode.com', query, variables)
    .then((data) => console.log(data))
    .catch((error) => core.setFailed(error.message));
}

run().catch((error) => core.setFailed(error.message));
