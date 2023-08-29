<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col items-center px-4 py-8">
	<h1 class="text-xl font-bold">Login</h1>
	{#each data.flow.ui.messages ?? [] as message}
		<div class="text-red-700 my-2">{message.text}</div>
	{/each}
	<form method={data.flow.ui.method} action={data.flow.ui.action} class="my-6">
		<input type="hidden" name="provider" value="google" />
		{#each data.flow.ui.nodes as node}
			{#if node.attributes.type === 'submit'}
				<button
					type={node.attributes.type}
					name={node.attributes.name}
					value={node.attributes.value}
					disabled={node.attributes.disabled}
					class="rounded-md bg-slate-700 text-white p-4">{node.meta.label?.text}</button
				>
			{:else if node.type === 'input'}
				<input
					type={node.attributes.type}
					name={node.attributes.name}
					value={node.attributes.value}
					disabled={node.attributes.disabled}
					required={node.attributes.required}
				/>
			{/if}
		{/each}
	</form>
</div>
