<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		window.addEventListener('paste', (e: ClipboardEvent) => {
			if (!document.activeElement?.className.split(' ').includes('editable')) return;
			e.preventDefault();
			const text = e.clipboardData?.getData('text/plain');
			const selection = window.getSelection();
			if (selection?.rangeCount) {
				selection.deleteFromDocument();
				selection.getRangeAt(0).insertNode(document.createTextNode(text || ''));
			}
		});

		window.addEventListener('keydown', (e: KeyboardEvent) => {
			if (!document.activeElement?.className.split(' ').includes('editable')) return;
			if (e.key === 'Enter') {
				e.preventDefault();
				let newElement = document.activeElement?.insertAdjacentHTML(
					'afterend',
					'<div contenteditable="true" class="editable"></div>'
				);
				(document.activeElement?.nextElementSibling as HTMLElement)?.focus();
			}
		});
	});
</script>

<p>HI!</p>

<div id="editables">
	<div contenteditable="true" class="editable"></div>
</div>
