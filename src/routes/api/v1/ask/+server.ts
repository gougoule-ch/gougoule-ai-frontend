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

	const readableStream = new Readable({
		read() {}
	});

	(async () => {
		for await (const chunk of stream) {
			if (chunk.choices[0].delta.content) {
				const content = chunk.choices[0].delta.content;
				readableStream.push(content);
			}
		}
		readableStream.push(null); // Signal the end of the stream
	})();

	const webReadableStream = new ReadableStream({
		start(controller) {
			readableStream.on('data', (chunk) => controller.enqueue(chunk));
			readableStream.on('end', () => controller.close());
			readableStream.on('error', (err) => controller.error(err));
		}
	});

	return new Response(webReadableStream, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
