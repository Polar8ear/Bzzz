/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'bzzz',
			// removal: input?.stage === 'production' ? 'retain' : 'remove',
			home: 'aws',
			providers: {
				aws: {
					region: 'ap-northeast-1',
				},
			},
		}
	},
	async run() {
		const vpc = new sst.aws.Vpc('Vpc')
		const rds = new sst.aws.Postgres('DB', {
			vpc,
			scaling: {
				min: '1 ACU',
				max: '1 ACU',
			},
			databaseName: 'bzzz',
			version: '16.1',
		})
		new sst.aws.SvelteKit('Sveltekit', {
			link: [rds],
			buildCommand: 'pnpm build',
		})
	},
})
