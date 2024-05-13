import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'

import { drizzle } from 'drizzle-orm/aws-data-api/pg'
import { Resource } from 'sst'
import * as schema from '../../db/schema'
import { RDSDataClient } from '@aws-sdk/client-rds-data'

const rdsClient = new RDSDataClient({})

const db = drizzle(rdsClient, {
	database: Resource.DB.database,
	resourceArn: Resource.DB.clusterArn,
	secretArn: Resource.DB.secretArn,
	schema: schema,
})
const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessions, schema.users)

export { adapter, db }
