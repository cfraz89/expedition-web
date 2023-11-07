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
		if (e instanceof HTTPError) {
			console.log('whoami http error', e.response.status);
			return { whoami: undefined };
		}
		throw e;
	}
};
