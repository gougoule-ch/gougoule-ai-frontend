import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export const authSession = pgTable('auth_session', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	sessionToken: text('session_token').notNull(),
	expires: timestamp('expires').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export const message = pgTable('message', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
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
