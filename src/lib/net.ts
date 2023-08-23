import ky from 'ky';
import { PUBLIC_BACKEND_ORIGIN, PUBLIC_KRATOS_ORIGIN } from '$env/static/public';
import dns from 'node:dns';
import { browser } from '$app/environment';

if (!browser) {
	dns.setDefaultResultOrder('ipv4first');
}

export const appKy = ky.extend({ prefixUrl: PUBLIC_BACKEND_ORIGIN });
export const kratosKy = ky.extend({ prefixUrl: PUBLIC_KRATOS_ORIGIN });
