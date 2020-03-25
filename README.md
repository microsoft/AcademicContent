# Tech Resources for Academic Communities, including students, faculty, research and life-long learners

This repository lists content suitable for students/faculty to learn Azure and other Microsoft technologies.

## Signing up for Azure

You can get free Azure credits to explore these resources here:

* [Azure for Students](https://azure.microsoft.com/free/students/?WT.mc_id=academiccontent-github-cxa) | $100 in Azure for 12 months with free tier of services - no credit card required with academic verification
* [Azure for Students Starter](https://azure.microsoft.com/free/students-starter-faq/?WT.mc_id=academiccontent-github-cxa) | use select Azure products like App Services for free - no credit card required with academic verification
* [Azure Free Account](https://azure.microsoft.com/free/?WT.mc_id=academiccontent-github-cxa) | $200 in Azure for one month with free tier of services - requires a credit card and probably the best fit for faculty evaluating Azure for course instruction unless your organization has a grant or enterprise agreement.

## Structure of this repository

This repository is designed to build a [VuePress](https://vuepress.vuejs.org) site that is hosted using GitHub Pages.

The content of this site lives in the [docs](./docs) folder. The main page is constructed from the [README.md](./docs/README.md) in that folder, and the side bar is made of the contents of the [content](./docs/content) folder.

## Building the docs

To build these docs, you will need [npm](https://www.npmjs.com/get-npm) installed. Once you have this installed, install VuePress:

```sh
npm install vuepress
```

To build the docs, use the [`deploy.sh`](./deploy.sh) script. This script will build the docs, then push them to the `gh-pages` branch of a given fork of this project. You pass the GitHub user/org name to the script. This way you can test the build offline, then push to the parent as part of an automated script.

```sh
deploy.sh <org>
```

> Do not push to the gh-pages branch manually, as this branch is completely rebuilt during the deploy, overwriting all history.

## Contributing

We 💖**love**💖 contributions. In fact, we want students, faculty, researchers and life-long learners to contribute to this repo, either by adding links to existing content, or building content. Please read the [contributing guide](./docs/CONTRIBUTING.md) to learn more.
