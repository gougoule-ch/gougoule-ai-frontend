<script>
	import { onMount, tick } from 'svelte';
	import ChevronDown from '../svg/chevronDown.svelte';
	import { password } from '$lib/store';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import PencilSquare from '../svg/PencilSquare.svelte';
	import TrashCan from '../svg/TrashCan.svelte';
	import EllipsisVertical from '../svg/EllipsisVertical.svelte';
	import { tapOutside } from 'svelte-outside';

	export let projectId;

	var selectedProject = { id: 1, name: 'No project' };
	var projects = [];
	var displayProjectSelector = false;
	var showProjectSettings = false;
	var projectName = '';
	var modifiedProject;
	var displayedEllipsis = null;

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
		await tick();
		document.getElementById('projectNameInput').focus();
	}

	async function saveProject() {
		if (modifiedProject) {
			const response = await fetch(`/api/v1/project/`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${get(password)}`
				},
				body: JSON.stringify({ name: projectName, id: modifiedProject.id })
			});
			if (!response.ok) {
				console.error('Failed to update project:', response.statusText);
				return;
			}
			projects = projects.map((project) =>
				project.id === modifiedProject.id ? { ...project, name: projectName } : project
			);
			modifiedProject = null;
			projectName = '';
			showProjectSettings = false;
			return;
		}
		const response = await fetch('/api/v1/project', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(password)}`
			},
			body: JSON.stringify({ name: projectName })
		});
		if (!response.ok) {
			console.error('Failed to create project:', response.statusText);
			return;
		}
		changeProject({ id: (await response.json()).id, name: projectName });
		projectName = '';
		showProjectSettings = false;
		projects = [...projects, selectedProject].sort((a, b) => a.name.localeCompare(b.name));
	}

	function changeProject(project) {
		goto(`/p/${project.id}`);
		selectedProject = project;
		projectId = project.id;
		displayProjectSelector = false;
	}

	const handleOutsideClickProjectSelector = (e) => {
		let target = e.target;
		while (target) {
			if (target.classList?.contains('preventClosingProjectsModal') || showProjectSettings) {
				return;
			}
			target = target.parentElement;
		}
		displayProjectSelector = false;
		displayedEllipsis = null;
	};

	const handleOutsideClickEllipsis = (e) => {
		let target = e.target;
		while (target) {
			if (target.classList?.contains('preventClosingEllipsis')) {
				return;
			}
			target = target.parentElement;
		}
		displayedEllipsis = null;
	};

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this project?')) {
			return;
		}
		const response = await fetch(`/api/v1/project/`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${get(password)}`
			},
			body: JSON.stringify({ id: modifiedProject.id })
		});
		if (!response.ok) {
			console.error('Failed to delete project:', response.statusText);
			return;
		}
		projects = projects.filter((project) => project.id !== modifiedProject.id);
		if (projectId == modifiedProject.id) changeProject(projects[0]);

		modifiedProject = null;
		displayProjectSelector = false;
		displayedEllipsis = null;
	}
</script>

<button
	on:click={() => (displayProjectSelector = !displayProjectSelector)}
	class="preventClosingProjectsModal flex w-full items-center justify-between rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
>
	<p class="font-medium text-white">{selectedProject.name}</p>
	<ChevronDown />
</button>
{#if displayProjectSelector}
	<div
		class="absolute mt-2 flex w-[calc(300px_-_1.5rem)] flex-col gap-2 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2"
		use:tapOutside={handleOutsideClickProjectSelector}
	>
		{#each projects as project, i}
			<div class="flex gap-2">
				<button
					on:click={() => {
						changeProject(project);
					}}
					class="w-full cursor-pointer rounded-xl border-2 p-2 text-start transition-colors duration-200 {project.id ==
					projectId
						? 'border-zinc-300'
						: 'border-zinc-600'} bg-zinc-800 hover:bg-zinc-600"
				>
					<p class="font-medium text-white">{project.name}</p>
				</button>
				<button
					on:click={() => {
						if (displayedEllipsis != i) {
							displayedEllipsis = i;
						} else {
							displayedEllipsis = null;
						}
					}}
					class="preventClosingEllipsis cursor-pointer rounded-xl p-2 text-start transition-colors duration-200 hover:bg-zinc-600 {displayedEllipsis ==
					i
						? 'bg-zinc-600'
						: 'bg-zinc-800'}"><EllipsisVertical /></button
				>
				{#if displayedEllipsis == i}
					<div
						class="fixed left-[290px] flex flex-col rounded-xl bg-zinc-800 p-2"
						style="box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5);"
						use:tapOutside={handleOutsideClickEllipsis}
					>
						<button
							on:click={async () => {
								displayedEllipsis = null;
								modifiedProject = project;
								projectName = project.name;
								showProjectSettings = true;
								await tick();
								document.getElementById('projectNameInput').focus();
							}}
							class="flex cursor-pointer rounded-xl bg-zinc-800 p-2 text-start transition-colors duration-200 hover:bg-zinc-600"
						>
							Rename
							<PencilSquare />
						</button>
						<button
							class="flex cursor-pointer rounded-xl bg-zinc-800 p-2 text-start transition-colors duration-200 hover:bg-zinc-600"
							on:click={() => {
								modifiedProject = project;
								handleDelete();
							}}
						>
							Delete
							<TrashCan /></button
						>
					</div>
				{/if}
			</div>
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
	<div class="fixed top-0 left-0 z-10 h-[100dvh] w-screen bg-black/50">
		<div
			class="fixed top-[calc(50%_-_4rem)] left-[calc(50%_-_12rem)] w-96 rounded-3xl border-2 border-zinc-600 bg-zinc-800 p-5"
		>
			<p class="mb-3 text-xl font-semibold">Name :</p>
			<input
				type="text"
				placeholder="Project name"
				id="projectNameInput"
				class="mb-2 w-full rounded-xl border-2 border-zinc-600 p-1 outline-none"
				bind:value={projectName}
			/>
			<button
				on:click={saveProject}
				class="w-full cursor-pointer rounded-xl border-2 border-zinc-600 p-2">Save</button
			>
		</div>
	</div>
{/if}
