import ky from 'ky';
import { env } from '$env/dynamic/public';

export const appKy = ky.extend({ prefixUrl: env.PUBLIC_BACKEND_ORIGIN });
export const KRATOS_CORS = env.PUBLIC_KRATOS_CORS === 'true';
export const kratosKy = ky.extend({
	prefixUrl: env.PUBLIC_KRATOS_ORIGIN,
	credentials: 'include',
	mode: KRATOS_CORS ? 'cors' : 'no-cors'
});
