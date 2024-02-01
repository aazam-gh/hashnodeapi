const { request } = require("graphql-request");


const query = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        slug
        title
        subtitle
        url
        canonicalUrl
        cuid
        brief
        readTimeInMinutes
        views
        reactionCount
        replyCount
        responseCount
        featured
        featuredAt
        publishedAt
        updatedAt
        hasLatexInPost
        isFollowed
        isAutoPublishedFromRSS
      }
    }
  }
 `;

const customObjectId = generateObjectId();

const input = {
  title: "Testing the title",
  subtitle: "Testing the subtitle",
  publicationId: customObjectId,
  contentMarkdown: "random content",
};

request(
  "https://gql.hashnode.com",
  query,
  { input: input },
  {
    headers: {
      Authorization: "f5a5ab11-1a11-49ba-baf3-298e63e37ea7",
    },
  }
).then((data) => console.log(data))

