import type { Config } from 'drizzle-kit'
import { RDS } from 'sst/node/rds'

export default {
	schema: './src/db/schema.ts',
	out: './.drizzle',
	dialect: 'postgresql',
	driver: 'aws-data-api',
	dbCredentials: {
		database: RDS.db.defaultDatabaseName,
		resourceArn: RDS.db.clusterArn,
		secretArn: RDS.db.secretArn,
	},
} satisfies Config
