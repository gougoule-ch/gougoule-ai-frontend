<script lang="ts">
	import Project from './sideBar/Project.svelte';

	export let projectId;
</script>

<div class="max-[100vh] h-[100dvh] bg-zinc-800 p-3 max-[100vh]:fixed">
	<Project {projectId} />
</div>
