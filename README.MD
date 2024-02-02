# Hashnode Blog Publisher

This repository contains a GitHub Actions workflow that allows you to automatically publish a blog post on your Hashnode account whenever you push code to the main branch of your repository.

## Workflow Overview

The workflow is triggered on every push to the main branch. It sets up a Node.js environment, installs the necessary dependencies, sets up the environment variables, and runs a script (`hashnode-blog.js`) that handles the publishing of the blog post.

## Prerequisites

Before you can use this workflow, you need to store your Hashnode API Key and Cohere API Key as secrets in your GitHub repository. Follow these steps to do so:

1. Go to your GitHub repository and click on `Settings`.
2. Click on `Secrets` in the left sidebar.
3. Click on `New repository secret`.
4. Add `HASHNODE_API_KEY` as the name and paste your Hashnode API Key as the value.
5. Repeat the process for `COHERE_API_KEY`, pasting your Cohere API Key as the value.

To generate your Hashnode access token, go to https://hashnode.com/settings/developer and click on "Generate New Token".
You will also need to obtain your publication ID. This is the Object ID for your hashnode blog page. You can find this in the URL of your hashnode blog page when you go to your dashboard.
To obtain your Cohere API Key, head over to https://dashboard.cohere.com/api-keys and click on "Generate New Key"


## Usage

Once the secrets are set up, the workflow will automatically run on every push to the main branch. You do not need to trigger it manually.

## How hashnode-blog.js Works

The `hashnode-blog.js` file is a Node.js script that performs several operations to fetch information about a pull request and then generates a blog post about it. Here's how it works:

### Fetch PR Info
It starts by fetching the latest closed pull request from the GitHub repository using the `fetchPR` function. This function uses the Octokit library to send a GET request to the GitHub API and retrieve the pull request information.

### Fetch Commits, Files, Comments, and Reviews
After getting the pull request number, it fetches detailed information about the pull request such as the commits made (`fetchCommits`), the files changed (`fetchFiles`), the comments (`fetchComments`), and the reviews (`fetchReviews`). Each of these functions sends a GET request to the GitHub API to retrieve the relevant information.

### Generate Text
Once all the necessary information is gathered, it uses the Cohere AI API to generate a blog post about the pull request. This is done in the `generatedText` function, which takes the fetched information and constructs a prompt for the Cohere API. The API then generates a text based on this prompt.

### Publish Post
Finally, it publishes the generated blog post to the user's Hashnode account. This is done by sending a GraphQL mutation request to the Hashnode API with the generated content and other required fields such as the title, publication ID, and tags.


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
