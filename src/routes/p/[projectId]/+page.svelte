<script lang="ts">
	import Conversation from '$lib/components/conversation.svelte';
	import SideBar from '$lib/components/sideBar.svelte';

	let { data } = $props();
</script>

<div class="grid grid-cols-[300px_auto] max-[100vh]:grid-cols-[100vw]">
	<SideBar projectId={data.projectId} />
	<Conversation />
</div>

<style>
	:global(body) {
		background-color: black;
		color: white;
	}
</style>
