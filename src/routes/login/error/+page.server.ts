import type { PageServerLoad } from './$types';
import { kratosKy } from '$lib/net';
import { error, redirect } from '@sveltejs/kit';
import type { Flow, KratosError } from '$lib/kratos';
import { HTTPError } from 'ky';
import { PUBLIC_KRATOS_ORIGIN } from '$env/static/public';

export const load: PageServerLoad = async (event) => {
	const id = event.url.searchParams.get('id');
	if (!id) {
		throw error(401, 'No id on request');
	}

	try {
		const errorData = await kratosKy
			.get('self-service/errors', {
				searchParams: { id },
				fetch: event.fetch
			})
			.json<KratosError>();
		return {
			errorData
		};
	} catch (e) {
		if (e instanceof HTTPError && e.response.status === 404) {
			//Our flow no longer exists, go back to login
			throw redirect(301, `${PUBLIC_KRATOS_ORIGIN}/self-service/login/browser`);
		}
		throw e;
	}
};
