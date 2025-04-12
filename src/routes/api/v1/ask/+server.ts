import { db } from '$lib/server/db/index.js';
import { messages, roles } from '$lib/server/db/schema.js';
import login from '$lib/server/login';
import client from '$lib/server/openAI';
import { Readable } from 'stream';

export async function POST({ request }): Promise<Response> {
	// Check if the request is authenticated
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// fetch question from body
	const body = await request.json();
	const { question } = body;
	if (!question) {
		return new Response(JSON.stringify({ error: 'Question is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// fetch conversation history from db
	const conversationsRoles = await db.select({ id: roles.id, name: roles.name }).from(roles);
	const conversationHistory = (
		await db.select({ content: messages.content, role: messages.role }).from(messages)
	).map((msg) => {
		return {
			content: [{ type: 'text' as 'text', text: msg.content }],
			role: conversationsRoles.find((role) => role.id === msg.role)?.name as
				| 'user'
				| 'system'
				| 'assistant'
		};
	});

	// return response from API
	const stream = await client.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			...conversationHistory,
			{ role: 'user', content: [{ type: 'text', text: question }] }
		],
		stream: true
	});

	let answer = '';

	const readableStream = Readable.from(
		(async function* () {
			for await (const chunk of stream) {
				if (chunk.choices[0].delta.content) {
					yield chunk.choices[0].delta.content;
					answer += chunk.choices[0].delta.content;
				}
			}
			// Save the question and and response to db
			await db.insert(messages).values({
				content: question,
				role: conversationsRoles.find((role) => role.name === 'user')?.id as string
			});
			await db.insert(messages).values({
				content: answer,
				role: conversationsRoles.find((role) => role.name === 'assistant')?.id as string
			});
		})()
	);

	return new Response(
		new ReadableStream({
			start(controller) {
				(async () => {
					for await (const chunk of readableStream) {
						controller.enqueue(new TextEncoder().encode(chunk));
					}
					controller.close();
				})();
			}
		}),
		{
			headers: { 'Content-Type': 'text/plain' }
		}
	);
}
