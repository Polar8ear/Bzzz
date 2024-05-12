import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'

import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";
import * as schema from '$db/schema'

const rdsClient = new RDSDataClient({
});

const db = drizzle(rdsClient, {
	database: RDS.db.defaultDatabaseName,
	resourceArn: RDS.db.clusterArn,
	secretArn: RDS.db.secretArn,
	schema: schema,
 })
const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessions, schema.users)

export { adapter, db }
