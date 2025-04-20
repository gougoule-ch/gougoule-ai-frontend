<script lang="ts">
	import { expandedEllipsis, expandedFoldersIDs, folders, notes, password } from '$lib/store';
	import Folders from './folders/Folders.svelte';
	import { onMount } from 'svelte';
	import { newFolder } from './folders/functions';
	import { get } from 'svelte/store';

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
				expandedFoldersIDs.set(
					localStorage.getItem('expandedFoldersIDs')
						? JSON.parse(localStorage.getItem('expandedFoldersIDs'))
						: []
				);

				const notesResponse = await fetch('/api/v1/note', {
					headers: {
						Authorization: `Bearer ${pwd}`
					}
				});
				if (!notesResponse.ok) {
					console.error('Failed to fetch notes:', notesResponse.statusText);
					return;
				}
				notes.set((await notesResponse.json()).filter((note) => note.projectId == projectId));
				unsubscribe(); // Stop listening to the store after the password is used
			}
		});

		setInterval(() => {
			console.log(get(expandedEllipsis));
		}, 1000);
	});
</script>

<div class="mb-4 flex">
	<button
		on:click={() => newFolder(projectId)}
		class="w-full cursor-pointer rounded-xl bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
	>
		<p class="font-medium text-white">+ folder</p>
	</button>
	<button
		on:click={() => newFolder(projectId)}
		class="w-full cursor-pointer rounded-xl bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
	>
		<p class="font-medium text-white">+ note</p>
	</button>
	<button
		on:click={() => newFolder(projectId)}
		class="w-full cursor-pointer rounded-xl bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
	>
		<p class="font-medium text-white">+ chat</p>
	</button>
</div>
<Folders parentFolderId={null} {projectId} />
