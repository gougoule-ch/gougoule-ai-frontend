import { db } from '$lib/server/db/index.js';
import { folders } from '$lib/server/db/schema';
import login from '$lib/server/login';
import { eq } from 'drizzle-orm';

export async function GET({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const foldersFromDB = await db.select().from(folders);
	return new Response(JSON.stringify(foldersFromDB), {
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function POST({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const folder = await request.json();
	const newFolder = await db.insert(folders).values(folder).returning();
	return new Response(JSON.stringify(newFolder[0]), {
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function DELETE({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const folder = await request.json();
	await db.delete(folders).where(eq(folders.id, folder.id));
	return new Response('200 Success');
}

export async function PUT({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const folder = await request.json();
	await db.update(folders).set(folder).where(eq(folders.id, folder.id));
}
