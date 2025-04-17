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
				document.activeElement?.insertAdjacentHTML(
					'afterend',
					'<div contenteditable="true" class="editable"></div>'
				);
				(document.activeElement?.nextElementSibling as HTMLElement)?.focus();
			} else if (e.key === 'Backspace' && document.activeElement?.textContent === '') {
				e.preventDefault();
				const prev = document.activeElement?.previousElementSibling as HTMLElement;
				if (prev) {
					document.activeElement?.remove();
					prev.focus();
					const range = document.createRange();
					const sel = window.getSelection();
					range.selectNodeContents(prev);
					range.collapse(false);
					sel?.removeAllRanges();
					sel?.addRange(range);
				}
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				const prev = document.activeElement?.previousElementSibling as HTMLElement;
				if (prev) {
					prev.focus();
					const range = document.createRange();
					const sel = window.getSelection();
					range.selectNodeContents(prev);
					range.collapse(false);
					sel?.removeAllRanges();
					sel?.addRange(range);
				}
			} else if (e.key === 'ArrowDown') {
				e.preventDefault();
				const next = document.activeElement?.nextElementSibling as HTMLElement;
				if (next) {
					next.focus();
					const range = document.createRange();
					const sel = window.getSelection();
					range.selectNodeContents(next);
					range.collapse(false);
					sel?.removeAllRanges();
					sel?.addRange(range);
				}
			}
		});
	});
</script>

<p>HI!</p>

<div id="editables">
	<div contenteditable="true" class="editable"></div>
</div>
