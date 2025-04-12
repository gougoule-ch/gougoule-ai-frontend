import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const messages = pgTable('messages', {
	id: uuid('id').defaultRandom().primaryKey(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdateFn(() => new Date()),
	role: uuid('role_id')
		.notNull()
		.references(() => roles.id)
});

export const roles = pgTable('roles', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdateFn(() => new Date())
});
