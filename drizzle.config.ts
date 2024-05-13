import type { Config } from 'drizzle-kit'
import { Resource } from 'sst'

export default {
	schema: './src/db/schema.ts',
	out: './.drizzle',
	dialect: 'postgresql',
	driver: 'aws-data-api',
	dbCredentials: {
		database: Resource.DB.database,
		resourceArn: Resource.DB.clusterArn,
		secretArn: Resource.DB.secretArn,
	},
} satisfies Config
