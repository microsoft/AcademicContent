module.exports = {
    base: '/computerscience/',
	title: 'Academic Content for Students and Researchers',
	description: 'Curated workshops, articles, curriculum and more for teachers and students',
	themeConfig: {
		logo: '/assets/logo.png',
		search: true,
		lastUpdated: 'Last Updated',
		editLinks: true,
		editLinkText: 'Help us improve this page!',
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Code of Conduct', link: 'https://opensource.microsoft.com/codeofconduct/' },
			{ text: 'Contribute', link: '/CONTRIBUTING' },
		],
		sidebar: [
			'/content/learning-content',
			'/content/hackathon-content',
			'/content/event-content',
			'/content/k-12-content',
		],
	},
};
