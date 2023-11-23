import type { LayoutServerLoad } from './$types';
import { kratosKy } from '$lib/net';
import { HTTPError } from 'ky';
import type { WhoAmI } from '$lib/kratos';

export const load: LayoutServerLoad = async (event) => {
	try {
		const whoami = await kratosKy
			.get(`sessions/whoami`, {
				fetch: event.fetch
			})
			.json<WhoAmI>();

		return {
			whoami
		};
	} catch (e) {
		//Not logged in
		if (e instanceof HTTPError && e.response.status == 401) {
			return { whoami: undefined };
		}
		console.log('Whoami load failed. Is kratos running?');
		throw e;
	}
};
