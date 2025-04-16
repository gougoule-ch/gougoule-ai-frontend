<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Project from './sideBar/Project.svelte';
	import Bars3 from './svg/Bars3.svelte';

	export let projectId;

	let isLandscape = false;
	let displaySideBar = false;

	onMount(() => {
		isLandscape = window.innerWidth > window.innerHeight;
		window.onresize = () => {
			isLandscape = window.innerWidth > window.innerHeight;
		};
	});
</script>

{#if isLandscape || displaySideBar}
	<div class="max-[100vh] shadow-right z-10 h-[100dvh] w-[300px] bg-zinc-800 p-3 max-[100vh]:fixed">
		{#if !isLandscape}
			<button on:click={() => (displaySideBar = !displaySideBar)}><Bars3 /></button>
			<div class="h-3"></div>
		{/if}
		<Project {projectId} />
	</div>
{/if}
{#if !isLandscape}
	<div class="fixed top-0 w-full border-b-2 bg-black p-3">
		<button on:click={() => (displaySideBar = !displaySideBar)}><Bars3 /></button>
	</div>
{/if}

<style>
	.shadow-right {
		box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
	}
</style>
