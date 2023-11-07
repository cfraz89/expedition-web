<script lang="ts">
	import KratosUiForm from '../../components/kratos-ui-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col items-center px-4 py-8">
	<h1 class="text-xl font-bold">Registration</h1>
	<KratosUiForm ui={data.flow.ui} />
</div>
