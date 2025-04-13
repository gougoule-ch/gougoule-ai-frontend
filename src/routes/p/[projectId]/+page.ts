import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const { projectId } = params;

	return {
		projectId
	};
};
