import type { PageServerLoad } from './$types';
import { kratosKy } from '$lib/net';
import { error } from '@sveltejs/kit';
import type { Flow } from '$lib/kratos';

export const load: PageServerLoad = async (event) => {
	const cookie = event.request.headers.get('cookie');
	if (!cookie) {
		throw error(401, 'No cookie on request');
	}

	const flowId = event.url.searchParams.get('flow');
	if (!flowId) {
		throw error(401, 'No flow id on request');
	}

	const flow = await kratosKy
		.get('self-service/login/flows', {
			searchParams: { id: flowId },
			headers: {
				cookie
			}
		})
		.json<Flow>();
	console.log(flow);
	return {
		flow
	};
};
