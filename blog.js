const core = require('@actions/core');
const { request } = require('graphql-request')
const host = core.getInput('host');

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
`

request('https://gql.hashnode.com', query, { host: host})
 .then((data) => console.log(data))
