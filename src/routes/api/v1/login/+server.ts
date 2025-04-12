import login from '$lib/server/login.js';

export function POST({ request }): Response {
	const loginResponse = login(request);
	if (loginResponse.success) {
		return new Response('200 Success', { status: 200 });
	}
	return new Response(JSON.stringify({ error: loginResponse.error }), {
		status: 401,
		headers: { 'Content-Type': 'application/json' }
	});
}
