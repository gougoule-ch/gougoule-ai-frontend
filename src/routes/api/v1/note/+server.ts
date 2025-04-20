import { db } from '$lib/server/db/index.js';
import { notes } from '$lib/server/db/schema';
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

	const notesFromDB = await db.select().from(notes);
	return new Response(JSON.stringify(notesFromDB), {
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
	const note = await request.json();
	const newNote = await db.insert(notes).values(note).returning();
	return new Response(JSON.stringify(newNote[0]), {
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

	const note = await request.json();
	await db.delete(notes).where(eq(notes.id, note.id));
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

	const note = await request.json();
	await db.update(notes).set(note).where(eq(notes.id, note.id));
	return new Response('200 Success');
}
