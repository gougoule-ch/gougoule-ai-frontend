<script>
	import { onMount } from 'svelte';
	import ChevronDown from './svg/chevronDown.svelte';
	import { password } from '$lib/store';
	import { goto } from '$app/navigation';

	export let projectId;

	var selectedProject = { id: 1, name: 'Loading...' };
	var projects = [];
	var displayProjectSelector = false;
	var showProjectSettings = true;

	onMount(async () => {
		const unsubscribe = password.subscribe(async (pwd) => {
			if (pwd) {
				const response = await fetch('/api/v1/project', {
					headers: {
						Authorization: `Bearer ${pwd}`
					}
				});
				if (!response.ok) {
					console.error('Failed to fetch projects:', response.statusText);
					return;
				}
				projects = await response.json();
				selectedProject = projects.find((project) => project.id == projectId);
				unsubscribe(); // Stop listening to the store after the password is used
			}
		});
	});

	async function newProject() {
		showProjectSettings = true;
	}
</script>

<div class="max-[100vh] h-[100dvh] bg-zinc-800 p-3 max-[100vh]:fixed">
	<button
		on:click={() => (displayProjectSelector = !displayProjectSelector)}
		class="flex w-full items-center justify-between rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
	>
		<p class="font-medium text-white">{selectedProject.name}</p>
		<ChevronDown />
	</button>
	{#if displayProjectSelector}
		<div
			class="mt-2 flex w-full flex-col gap-2 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2"
		>
			{#each projects as project}
				<button
					on:click={() => {
						goto(`/p/${project.id}`);
						selectedProject = project;
						projectId = project.id;
						displayProjectSelector = false;
					}}
					class="w-full cursor-pointer rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
				>
					<p class="font-medium text-white">{project.name}</p>
				</button>
			{/each}
			<button
				on:click={newProject}
				class="w-full cursor-pointer rounded-xl bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
			>
				<p class="font-medium text-white">+ new project</p>
			</button>
		</div>
	{/if}
	{#if showProjectSettings}
		<div class=" fixed top-0 left-0 z-10 h-[100dvh] w-screen bg-black/50">
			<div
				class="fixed top-[calc(50%_-_4rem)] left-[calc(50%_-_12rem)] w-96 rounded-3xl border-2 border-zinc-600 bg-zinc-800 p-5"
			>
				<p class="mb-3 text-xl font-semibold">Name :</p>
				<input
					type="text"
					placeholder="Project name"
					class="mb-2 w-full rounded-xl border-2 border-zinc-600 p-1 outline-none"
				/>
				<button class="w-full rounded-xl border-2 border-zinc-600 p-2">Save</button>
			</div>
		</div>
	{/if}
</div>
