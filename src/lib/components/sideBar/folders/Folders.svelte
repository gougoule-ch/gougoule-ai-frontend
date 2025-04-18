<script lang="ts">
	import EllipsisVertical from '$lib/components/svg/EllipsisVertical.svelte';
	import MiniChevronDown from '$lib/components/svg/MiniChevronDown.svelte';
	import MiniChevronUp from '$lib/components/svg/MiniChevronUp.svelte';
	import Folders from './Folders.svelte';

	export let parentFolderId;
	export let folders;
	import { expandedFoldersIDs } from '$lib/store';
</script>

<div class="flex flex-col gap-3 pl-1">
	{#each folders as folder}
		{#if folder.parentFolderId == parentFolderId}
			<div class="flex justify-between rounded-xl hover:bg-zinc-600">
				<button class="w-full cursor-pointer py-2 pl-2 text-start">{folder.name}</button>
				<div class="flex items-center">
					<button class="cursor-pointer py-2"><EllipsisVertical /></button>
					<button
						class="cursor-pointer py-2 pr-2"
						on:click={() => {
							if ($expandedFoldersIDs.includes(folder.id)) {
								expandedFoldersIDs.set($expandedFoldersIDs.filter((id) => id !== folder.id));
							} else {
								expandedFoldersIDs.set([...$expandedFoldersIDs, folder.id]);
							}
						}}
					>
						{#if $expandedFoldersIDs.includes(folder.id)}
							<MiniChevronDown />
						{:else}
							<MiniChevronUp />
						{/if}
					</button>
				</div>
			</div>
			{#if $expandedFoldersIDs.includes(folder.id) && folders.some((fldr) => fldr.parentFolderId == folder.id)}
				<div class="border-l-2">
					<Folders {folders} parentFolderId={folder.id} />
				</div>
			{/if}
		{/if}
	{/each}
</div>
