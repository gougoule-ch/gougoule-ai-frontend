import { writable } from 'svelte/store';

export const password = writable('');
export const expandedFoldersIDs = writable([]);
export const expandedPlus = writable(null);
export const expandedEllipsis = writable(null);
export const folders = writable([]);
