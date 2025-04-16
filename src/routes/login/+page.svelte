<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setCookie } from '$lib/cookies';

	let token = '';
	let error = '';

	async function handleLogin() {
		const response = await fetch('/api/v1/login', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			setCookie('password', token, 365);
			goto('/');
		} else {
			error = 'Login failed';
		}
	}
</script>

<main>
	<h1>Login</h1>
	<form on:submit|preventDefault={handleLogin}>
		<label for="token">Token:</label>
		<input id="token" bind:value={token} type="password" required />

		{#if error}
			<p style="color: red;">{error}</p>
		{/if}

		<button type="submit">Login</button>
	</form>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #f9f9f9;
		font-family: Arial, sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 20px;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #fff;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	label {
		margin-bottom: 10px;
		font-weight: bold;
		color: #555;
	}

	input {
		padding: 10px;
		margin-bottom: 20px;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 100%;
		max-width: 300px;
	}

	button {
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	button:hover {
		background-color: #0056b3;
	}

	p {
		color: red;
		margin-top: -10px;
		margin-bottom: 20px;
	}
</style>
