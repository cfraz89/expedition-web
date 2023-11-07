import type { PageServerLoad } from './$types';
import { kratosKy } from '$lib/net';
import { HTTPError } from 'ky';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_KRATOS_ORIGIN } from '$env/static/public';
import type { Flow } from '$lib/kratos';

export const load: PageServerLoad = async (event) => {
	const flowId = event.url.searchParams.get('flow');
	if (!flowId) {
		throw error(401, 'No flow id on request');
	}

	try {
		const flow = await kratosKy
			.get(`self-service/registration/flows`, {
				searchParams: { id: flowId },
				fetch: event.fetch
			})
			.json<Flow>();

		return {
			flow
		};
	} catch (e) {
		if (e instanceof HTTPError && e.response.status === 404) {
			//Our flow no longer exists, go back to login
			throw redirect(301, `${PUBLIC_KRATOS_ORIGIN}/self-service/login/browser`);
		}
		throw e;
	}
};
