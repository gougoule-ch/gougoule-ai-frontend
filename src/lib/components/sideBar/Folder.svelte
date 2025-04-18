<script>
	import { password } from '$lib/store';
	import { get } from 'svelte/store';
	import Folders from './folders/Folders.svelte';
	import { onMount } from 'svelte';

	export let projectId;

	let folders = [];

	onMount(async () => {
		const unsubscribe = password.subscribe(async (pwd) => {
			if (pwd) {
				const response = await fetch('/api/v1/folder', {
					headers: {
						Authorization: `Bearer ${pwd}`
					}
				});
				if (!response.ok) {
					console.error('Failed to fetch folders:', response.statusText);
					return;
				}
				folders = await response.json();
				unsubscribe(); // Stop listening to the store after the password is used
			}
		});
	});

	async function newFolder() {
		const response = await fetch('/api/v1/folder', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${get(password)}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: 'new folder',
				projectId
			})
		});
		if (!response.ok) {
			console.error('Failed to create folder:', response.statusText);
			return;
		}
		const folder = await response.json();
		folders = [...folders, folder];
		console.log(folder);
	}
</script>

<button
	on:click={newFolder}
	class="w-full cursor-pointer rounded-xl bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
>
	<p class="font-medium text-white">+ new folder</p>
</button>

<Folders parentFolderId={null} {folders} />
