import login from '$lib/server/login';
import client from '$lib/server/openAI';
import { Readable } from 'stream';

export async function POST({ request }): Promise<Response> {
	const loginResponse = login(request);
	if (!loginResponse.success) {
		return new Response(JSON.stringify({ error: loginResponse.error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const body = await request.json();
	const { question } = body;
	if (!question) {
		return new Response(JSON.stringify({ error: 'Question is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const stream = await client.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [{ role: 'user', content: [{ type: 'text', text: question }] }],
		stream: true
	});

	const readableStream = Readable.from(
		(async function* () {
			for await (const chunk of stream) {
				if (chunk.choices[0].delta.content) {
					yield chunk.choices[0].delta.content;
				}
			}
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
