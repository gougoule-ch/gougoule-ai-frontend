<script lang="ts">
	import { folders, password } from '$lib/store';
	import Folders from './folders/Folders.svelte';
	import { onMount } from 'svelte';
	import { newFolder } from './folders/functions';

	export let projectId;

	onMount(async () => {
		const unsubscribe = password.subscribe(async (pwd) => {
			if (pwd) {
				var FoldersResponse = await fetch('/api/v1/folder', {
					headers: {
						Authorization: `Bearer ${pwd}`
					}
				});
				if (!FoldersResponse.ok) {
					console.error('Failed to fetch folders:', FoldersResponse.statusText);
					return;
				}
				folders.set(
					(await FoldersResponse.json()).filter((folder) => folder.projectId == projectId)
				);
				unsubscribe(); // Stop listening to the store after the password is used
			}
		});
	});
</script>

<button
	on:click={() => newFolder(projectId)}
	class="w-full cursor-pointer rounded-xl bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
>
	<p class="font-medium text-white">+ new folder</p>
</button>

<Folders parentFolderId={null} {projectId} />
