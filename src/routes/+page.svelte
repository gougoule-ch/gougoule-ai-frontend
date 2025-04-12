<script>
	import Send from '$lib/components/send.svelte';
	import { password } from '$lib/store';
	import { onMount, tick } from 'svelte';

	let messages = [];

	onMount(async () => {
		const unsubscribe = password.subscribe(async (pwd) => {
			if (pwd) {
				const response = await fetch('/api/v1/chat', {
					headers: {
						Authorization: `Bearer ${pwd}`
					}
				});
				messages = await response.json();

				scrollToBottom();
				adjustTextareaHeight();

				unsubscribe(); // Stop listening to the store after the password is used
			}
		});
	});

	function adjustTextareaHeight() {
		const scrollableMessageContainer = document.getElementById('scrollableMessageContainer');
		const scrolledToBottom =
			scrollableMessageContainer.scrollTop ==
			scrollableMessageContainer.scrollHeight - scrollableMessageContainer.clientHeight;

		const textarea = document.getElementById('messageTextArea');
		textarea.style.height = 'auto'; // Reset height to calculate the new height
		const maxHeight = 8.3 * parseFloat(getComputedStyle(textarea).lineHeight); // Limit to 20 rows
		textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
		textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'scroll' : 'hidden';

		if (scrolledToBottom) {
			scrollToBottom();
		}

		updatePaddingBottom();
	}

	function updatePaddingBottom() {
		const textarea = document.getElementById('messageTextArea');
		const paddingBottom = parseFloat(getComputedStyle(textarea).height);
		const scrollableMessageContainer = document.getElementById('scrollableMessageContainer');
		scrollableMessageContainer.style.paddingBottom = `${paddingBottom + 130}px`;
	}

	async function scrollToBottom() {
		await tick();
		const scrollableMessageContainer = document.getElementById('scrollableMessageContainer');
		const scrollHeight = scrollableMessageContainer.scrollHeight;
		scrollableMessageContainer.scrollTop = scrollHeight;
	}
</script>

<div class="grid grid-cols-[300px_auto] max-[100vh]:grid-cols-[100vw]">
	<div class="max-[100vh] h-[100dvh] bg-zinc-800 max-[100vh]:fixed"></div>
	<div
		class="flex h-[100dvh] flex-col items-center overflow-y-auto"
		id="scrollableMessageContainer"
	>
		<div class="flex max-w-[700px] flex-col gap-10 px-4 pt-4" id="messagesContainer">
			{#each messages as message}
				{#if message.role == 'assistant'}
					<p>{message.content}</p>
				{:else if message.role == 'user'}
					<p class="self-end rounded-2xl bg-zinc-800 p-3">{message.content}</p>
				{/if}
			{/each}
		</div>
		<div
			class="fixed bottom-4 w-[calc(100%_-_1rem)] max-w-[700px] rounded-4xl bg-zinc-800 p-3 px-5 pt-5"
			style="box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5);"
		>
			<textarea
				name="message"
				id="messageTextArea"
				class="w-full resize-none outline-none"
				placeholder="What is Gougoule ?"
				on:input={adjustTextareaHeight}
				rows="1"
			></textarea>
			<div class="flex justify-end">
				<button class="cursor-pointer rounded-full p-2 hover:bg-black hover:invert"><Send /></button
				>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: black;
		color: white;
	}
</style>
