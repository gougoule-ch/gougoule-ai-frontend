import { folders, password } from '$lib/store';
import { get } from 'svelte/store';

export async function newFolder(projectId, parentId: number | null = null) {
	const response = await fetch('/api/v1/folder', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${get(password)}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: 'new folder',
			projectId,
			parentFolderId: parentId
		})
	});
	if (!response.ok) {
		console.error('Failed to create folder:', response.statusText);
		return;
	}
	const folder = await response.json();
	folders.set([...get(folders), folder]);
	console.log(folder);
}
