<script lang="ts">
	import '../app.css';
	import logo from '$lib/assets/logo.webp';
	import { env } from '$env/dynamic/public';
	import type { LayoutData } from './$types';

	const {data, children} = $props<{data: LayoutData, children: ()=>any}>()
</script>

<div class="h-screen grid grid-rows-shell">
	<div class="bg-gray-800 flex items-center justify-between px-6 py-2">
		<a href="/"><img src={logo} alt="logo" class="p-2 w-80" /></a>
		<a href="{env.PUBLIC_KRATOS_ORIGIN}/self-service/login/browser" class="text-white">
			{#if data.whoami}
				{data.whoami.identity.traits.email}
			{:else}
				Login
			{/if}</a
		>
	</div>
	{@render children()}
</div>
