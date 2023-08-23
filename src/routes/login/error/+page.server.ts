import type { PageServerLoad } from './$types';
import { kratosKy } from '$lib/net';
import { error } from '@sveltejs/kit';
import type { Flow, KratosError } from '$lib/kratos';

export const load: PageServerLoad = async (event) => {
	const cookie = event.request.headers.get('cookie');
	if (!cookie) {
		throw error(401, 'No cookie on request');
	}

	const id = event.url.searchParams.get('id');
	if (!id) {
		throw error(401, 'No id on request');
	}

	const errorData = await kratosKy
		.get('self-service/errors', {
			searchParams: { id },
			headers: {
				cookie
			}
		})
		.json<KratosError>();
	return {
		errorData
	};
};
