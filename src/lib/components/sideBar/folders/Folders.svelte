<script lang="ts">
	import EllipsisVertical from '$lib/components/svg/EllipsisVertical.svelte';
	import MiniChevronDown from '$lib/components/svg/MiniChevronDown.svelte';
	import MiniChevronUp from '$lib/components/svg/MiniChevronUp.svelte';
	import Folders from './Folders.svelte';

	export let parentFolderId;
	export let projectId;

	import { expandedEllipsis, expandedFoldersIDs, expandedPlus, folders } from '$lib/store';
	import { get } from 'svelte/store';
	import { tapOutside } from 'svelte-outside';
	import PencilSquare from '$lib/components/svg/PencilSquare.svelte';
	import TrashCan from '$lib/components/svg/TrashCan.svelte';
	import { newFolder } from './functions';
</script>

<div class="flex flex-col gap-3 pl-1">
	{#each $folders as folder}
		{#if folder.parentFolderId == parentFolderId}
			<div class="flex justify-between rounded-xl hover:bg-zinc-600">
				<button class="w-full cursor-pointer py-2 pl-2 text-start">{folder.name}</button>
				<div class="flex items-center">
					<button
						on:click={() => {
							if (get(expandedPlus) == folder.id) {
								expandedPlus.set(null);
							} else {
								expandedPlus.set(folder.id);
							}
						}}
						class="cursor-pointer py-2 pr-1 text-2xl"
					>
						+
					</button>
					<button
						id="ellipsisFolderButton-{folder.id}"
						on:click={() => {
							if (get(expandedEllipsis) == folder.id) {
								expandedEllipsis.set(null);
							} else {
								expandedEllipsis.set(folder.id);
							}
						}}
						class="cursor-pointer py-2"><EllipsisVertical /></button
					>
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
			{#if $expandedFoldersIDs.includes(folder.id) && $folders.some((fldr) => fldr.parentFolderId == folder.id)}
				<div class="border-l-2">
					<Folders {projectId} parentFolderId={folder.id} />
				</div>
			{/if}
			{#if $expandedEllipsis == folder.id}
				<div
					class="fixed ml-[290px] flex flex-col gap-2 rounded-2xl bg-zinc-800 p-3"
					use:tapOutside={(e) => {
						if (!(e.target as HTMLElement).closest(`#ellipsisFolderButton-${folder.id}`)) {
							expandedEllipsis.set(null);
						}
					}}
				>
					<button
						class="flex w-full cursor-pointer gap-2 rounded-xl p-2 text-start hover:bg-zinc-600"
						><PencilSquare /> Rename</button
					>
					<button
						class="flex w-full cursor-pointer gap-2 rounded-xl p-2 text-start hover:bg-zinc-600"
						><TrashCan /> Delete</button
					>
				</div>
			{/if}
			{#if $expandedPlus == folder.id}
				<div
					class="fixed ml-[290px] flex flex-col gap-2 rounded-2xl bg-zinc-800 p-3"
					use:tapOutside={() => expandedPlus.set(null)}
				>
					<button
						on:click={() => {
							newFolder(projectId, folder.id);
							expandedPlus.set(null);
						}}
						class="w-full cursor-pointer rounded-xl p-2 text-start hover:bg-zinc-600"
						>+ Folder</button
					>
					<button class="w-full cursor-pointer rounded-xl p-2 text-start hover:bg-zinc-600"
						>+ Note</button
					>
					<button class="w-full cursor-pointer rounded-xl p-2 text-start hover:bg-zinc-600">
						+ Conversation
					</button>
				</div>
			{/if}
		{/if}
	{/each}
</div>
