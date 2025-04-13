import { db } from '$lib/server/db/index.js';
import { projects } from '$lib/server/db/schema';
import login from '$lib/server/login';
import { eq } from 'drizzle-orm';

export async function POST({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const body = await request.json();
	const { name } = body;
	if (!name) {
		return new Response(JSON.stringify({ error: 'Name is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const projectReturning = await db
		.insert(projects)
		.values({
			name
		})
		.returning({
			id: projects.id
		});
	const projectId = projectReturning[0].id;
	return new Response(
		JSON.stringify({
			id: projectId
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}

export async function GET({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const projectsList = await db.select().from(projects).orderBy(projects.name);
	return new Response(JSON.stringify(projectsList), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
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

	const body = await request.json();
	const { id, name } = body;
	if (!id || !name) {
		return new Response(JSON.stringify({ error: 'Id and Name are required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	await db
		.update(projects)
		.set({
			name
		})
		.where(eq(projects.id, id));
	return new Response('200 Success', {
		status: 200
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

	const body = await request.json();
	const { id } = body;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Id is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	await db.delete(projects).where(eq(projects.id, id));
	return new Response('200 Success', {
		status: 200
	});
}
