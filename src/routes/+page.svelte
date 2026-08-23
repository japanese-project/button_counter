<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '../components/Header.svelte';
	import NumberDisplay from '../components/Number.svelte';
	import CounterButton from '../components/Button.svelte';
	import { countLive } from './counter.remote';

	const count = countLive();
	let liveCount: number = $derived(count.current ?? 0);
</script>

<svelte:head>
	<title>Button Counter</title>
	<meta
		name="description"
		content="A button counter built with SvelteKit, TypeScript, and Tailwind CSS"
	/>
</svelte:head>

<div class="min-h-screen bg-stone-100 text-gray-900">
	<Header />

	<main class="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-8 px-4 py-8">
		<NumberDisplay count={liveCount} />

		<form method="POST" action="?/increment" use:enhance>
			<CounterButton onTrigger={() => {
				liveCount++;
			}} />
		</form>
	</main>
</div>
