const { request } = require('graphql-request')

const query = `
query Publication {
 publication(host: "alcadeus.hashnode.dev") {
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

request('https://api.example.com/graphql', query)
 .then((data) => console.log(data))
