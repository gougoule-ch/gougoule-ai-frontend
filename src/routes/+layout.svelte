<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { getCookie } from '$lib/cookies';
	import { goto } from '$app/navigation';
	import { password } from '$lib/store';

	let { children } = $props();

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
