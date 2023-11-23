<script lang="ts">
	import type { Flow } from '$lib/kratos';

	const { ui } = $props<{ ui: Flow['ui'] }>();
</script>

<div>
	{#each ui.messages ?? [] as message}
		<div class="text-red-700 my-2">{message.text}</div>
	{/each}
	<form
		method={ui.method}
		action={ui.action}
		class="my-6 grid grid-cols-2 gap-y-4 gap-x-2 items-center"
	>
		{#each ui.nodes as node}
			{@const type = node.attributes.type}
			{@const name = node.attributes.name}
			{@const value = node.attributes.value ?? ''}
			{#if type === 'submit'}
				<button
					{type}
					{name}
					{value}
					disabled={node.attributes.disabled}
					class="rounded-md bg-slate-700 text-white p-4 col-span-2">{node.meta.label?.text}</button
				>
			{:else if node.type === 'input'}
				{#if node.meta.label}
					<label for={name}>{node.meta.label.text}</label>
				{/if}
				<input
					{type}
					{name}
					{value}
					disabled={node.attributes.disabled}
					required={node.attributes.required}
					class="rounded-md border-slate-700 border p-2"
				/>
				{#each node.messages as message}
					<span class="col-span-2 text-end" class:text-red-700={message.type === 'error'}
						>{message.text}</span
					>
				{/each}
			{/if}
		{/each}
	</form>
</div>
