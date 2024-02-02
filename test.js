const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: "gdtBTLAUe0w1tRM8FWdLHQ46l5TErYu8MYOkrNnc", // This is your trial API key
});

  const generatedText = async () => {
    const response = await cohere.generate({
      model: "command",
      prompt: `I will provide you details of a pull request, including some of the files, review comments, and information. I want you to generate a blog post about it in markdown format. The details of the pull request are as follows. Some of the files which have been changed. Any of the revie Any of the comments. The commit messages.`,
      maxTokens: 300,
      temperature: 0.3,
      k: 0,
      stopSequences: [],
      returnLikelihoods: "NONE",
    });
    return `${response.generations[0].text}`;
  };
  const content =  await generatedText();

console.log(content)
