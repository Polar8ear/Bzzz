import { services } from '$lib/server/db/schema'
import { createInsertSchema } from 'drizzle-zod'

export const insertOrUpdateServiceSchema = createInsertSchema(services)
