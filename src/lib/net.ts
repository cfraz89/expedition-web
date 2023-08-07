import ky from 'ky';
import { PUBLIC_BACKEND_ORIGIN } from '$env/static/public';

export const appKy = ky.extend({ prefixUrl: PUBLIC_BACKEND_ORIGIN });
