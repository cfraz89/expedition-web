<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import logo from '$lib/assets/logo.webp';
	import { env } from '$env/dynamic/public';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="h-screen grid grid-rows-shell">
		<div class="bg-gray-800 flex items-center justify-between px-6 py-2">
			<a href="/"><img src={logo} alt="logo" class="p-2 w-64" /></a>
			<a href="{env.PUBLIC_KRATOS_ORIGIN}/self-service/login/browser" class="text-white">Login</a>
		</div>
		<slot />
	</div>
</QueryClientProvider>
