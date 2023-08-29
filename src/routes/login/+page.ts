import type { PageLoad } from './$types';
import { kratosKy } from '$lib/net';
import { error } from '@sveltejs/kit';
import type { Flow } from '$lib/kratos';

export const load: PageLoad = async (event) => {
	const flowId = event.url.searchParams.get('flow');
	if (!flowId) {
		throw error(401, 'No flow id on request');
	}

	const flow = await kratosKy
		.get('self-service/login/flows', {
			credentials: 'include',
			searchParams: { id: flowId },
			fetch: event.fetch
		})
		.json<Flow>();

	return {
		flow
	};
};
