import ky from 'ky';
import { env } from '$env/dynamic/public';

export const appKy = ky.extend({ prefixUrl: env.PUBLIC_BACKEND_ORIGIN });
export const kratosKy = ky.extend({ prefixUrl: env.PUBLIC_KRATOS_ORIGIN });
