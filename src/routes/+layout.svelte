<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import '../app.css';
	import { getCookie } from '$lib/cookies';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const password = writable('');
	onMount(() => {
		const storedPassword = getCookie('password');
		if (!storedPassword) {
			goto('/login');
			return;
		}
		password.set(storedPassword);
	});
</script>

{@render children()}
