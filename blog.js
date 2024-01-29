const fetch = require('node-fetch');

const mutation = `
mutation ($input: CreatePostInput!) {
 createPost(input: $input) {
    post {
      slug
    }
 }
}`;


const variables = {
    input: {
       title: 'Your Blog Title',
       contentMarkdown: '# Your Blog Content\n\nThis is a blog post.',
       // Add any other fields you need
    },
   };

   
   fetch('https://gql.hashnode.com/', {
    method: 'POST',
    headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.HASHNODE_API_KEY}`,
    },
    body: JSON.stringify({
       query: mutation,
       variables: variables,
    }),
   })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(error => console.error(error));
   