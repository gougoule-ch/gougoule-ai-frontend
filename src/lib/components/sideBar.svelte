<script>
	import ChevronDown from './svg/chevronDown.svelte';

	var selectedProject = { id: 1, name: 'Dev Project' };
	var displayProjectSelector = false;
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
			<button
				class="w-full rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
			>
				<p class="font-medium text-white">Project 1</p>
			</button>
			<button
				class="w-full rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
			>
				<p class="font-medium text-white">Project 2</p>
			</button>
			<button
				class="w-full rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
			>
				<p class="font-medium text-white">Project 3</p>
			</button>
			<button
				class="w-full rounded-xl border-2 border-zinc-600 bg-zinc-800 p-2 transition-colors duration-200 hover:bg-zinc-600"
			>
				<p class="font-medium text-white">Project 4</p>
			</button>
		</div>
	{/if}
</div>
