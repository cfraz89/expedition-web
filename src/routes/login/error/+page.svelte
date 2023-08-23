<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="flex flex-col items-center px-4 py-8">
	<h1 class="text-xl font-bold">Login Errors!</h1>
	<div>
		<div>{data.errorData.error.reason}</div>
		<div>{data.errorData.error.message}</div>
	</div>
</div>
