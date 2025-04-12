import { db } from '$lib/server/db/index.js';
import { messages, roles } from '$lib/server/db/schema.js';
import login from '$lib/server/login';

export async function GET({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const rolesFromDB = await db.select({ id: roles.id, name: roles.name }).from(roles);
	const chatHistory = (
		await db
			.select({ created_at: messages.createdAt, content: messages.content, role: messages.role })
			.from(messages)
	).map((msg) => {
		return {
			content: msg.content,
			created_at: msg.created_at,
			role: rolesFromDB.find((role) => role.id === msg.role)?.name
		};
	});
	return new Response(JSON.stringify(chatHistory), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
