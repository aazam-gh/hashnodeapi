const { request } = require("graphql-request");

const query = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        slug
        title
        isAutoPublishedFromRSS
      }
    }
  }
 `;

const input = {
  title: "Testing the title",
  subtitle: "Testing the subtitle",
  publicationId: "65b4ce9bf826b65f627bc286",
  contentMarkdown: "random content",
  tags: [
    {
      "slug": "test1",
      "name": "test2"
    },
  ],
};

const headers = {
  Authorization: "f5a5ab11-1a11-49ba-baf3-298e63e37ea7",
};

request("https://gql.hashnode.com", query, { input }, headers)
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
