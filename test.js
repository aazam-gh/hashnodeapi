
const cohere = new CohereClient({
  token: "gdtBTLAUe0w1tRM8FWdLHQ46l5TErYu8MYOkrNnc", // This is your trial API key
});

(async () => {
  const response = await cohere.generate({
    model: "command",
    prompt:
      "I will provide you details of a pull request, including some of the files, review comments, and information. I want you to generate a blog post about it in markdown format. The details of the pull request are as follows:\nTitle:Added Example to Upload Images using Ruby SDK #101\nFix #68\n\nSimilar to node sdk example to upload images to cloudinary. An example has been made for uploading images using Cloudinary Ruby SDK.\nREADME file describes simple steps to get started on adding cloudinary to your Gemfile \nCOmments: \ncolbyfayock reviewed on Oct 13, 2023\nexamples/ruby-image-upload/Gemfile\n\ngem 'cloudinary'\ngroup :development do\n  gem 'dotenv-rails'\nCollaborator\n@colbyfayock colbyfayock on Oct 13, 2023\ncurious about this one, it imports in the ruby file as dotenv, is that accurate?\n\nContributor\nAuthor\n@aazam-gh aazam-gh on Oct 13, 2023\nYes this will allow us to use env\n\n@aazam-gh	Reply...\ncolbyfayock\ncolbyfayock reviewed on Oct 13, 2023\nexamples/ruby-image-upload/README.md\n* Install the project dependencies with:\n\n```\ngem install\nCollaborator\n@colbyfayock colbyfayock on Oct 13, 2023\ngem install doesnt seem to install all the dependencies, looks like you need to use bundler?\n\nhttps://stackoverflow.com/a/44406252/844780\n\nContributor\nAuthor\n@aazam-gh aazam-gh on Oct 13, 2023\nYes the user needs to have bundler already installed for gem install to work.\n\n@aazam-gh	Reply...\ncolbyfayock\ncolbyfayock reviewed on Oct 13, 2023\nexamples/ruby-image-upload/README.md\n\n* Create an environment variable file `.env` and inside add:\n```\nCLOUDINARY_CLOUD_NAME=\"<Your Cloud Name>\"\nCollaborator\n@colbyfayock colbyfayock on Oct 13, 2023\nYou need to add the API KEY and API SECRET to the instructions, not just the cloud name, for getting the local example running\n\nContributor\nAuthor\n@aazam-gh aazam-gh on Oct 13, 2023\nNoted. I'll add the two as well\n\n@aazam-gh	Reply...\n@colbyfayock\nCollaborator\ncolbyfayock commented on Oct 13, 2023\nhey @aazam-gh got it running and worked great! have a few comments here first before we merge it in. let me know what you think\n\n@aazam-gh\nupdated README.MD\n2bbd7e3\n@aazam-gh\nContributor\nAuthor\naazam-gh commented on Oct 13, 2023\n@colbyfayock I have made some changes based on the reviews :)\n\n@colbyfayock\nCollaborator\ncolbyfayock commented on Oct 13, 2023\nlooks great, thanks @aazam-gh\n\n@colbyfayock colbyfayock merged commit 1467ba0 into cloudinary-community:main on Oct 13, 2023\n0 of 2 checks passed\n@colbyfayock colbyfayock added the hacktoberfest label on Oct 13, 2023\n@colbyfayock\nCollaborator\ncolbyfayock commented on Oct 13, 2023\n@aazam-gh congrats on the merged PR! since it was merged during Hacktoberfest, you're eligible for some free swag. Please email hacktoberfest@cloudinary.com with your Github username and a link to this PR where we'll follow up with you there.\n\nhttps://cloudinary.com/blog/hacktoberfest-celebrate-open-source-sdks\n\n@colbyfayock\nCollaborator\ncolbyfayock commented on Oct 13, 2023\n@all-contributors please add @aazam-gh for code\n\n@allcontributors allcontributors bot mentioned this pull request on Oct 13, 2023\ndocs: add aazam-gh as a contributor for code #103\n Merged\n@allcontributors\nContributor\nallcontributors bot commented on Oct 13, 2023\n@colbyfayock\n\nI've put up a pull request to add @aazam-gh! 🎉\n\n@aazam-gh aazam-gh \ndeleted the cloudruby branch 4 months ago\n@aazam-gh\nContributor\nAuthor\naazam-gh commented on Oct 13, 2023\n@colbyfayock Thanks for merging. I have sent an email :D\n\n",
    maxTokens: 300,
    temperature: 0.3,
    k: 0,
    stopSequences: [],
    returnLikelihoods: "NONE",
  });
  console.log(`${response.generations[0].text}`);
})();
