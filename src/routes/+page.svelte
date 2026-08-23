<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '../components/Header.svelte';
	import NumberDisplay from '../components/Number.svelte';
	import CounterButton from '../components/Button.svelte';
	import { countLive } from './counter.remote';

	const TIMEOUT = 500;

	const count = countLive();
	let startCount: number = $derived(count.current ?? 0);
	let liveCount: number = $derived(count.current ?? 0);
	let timer: NodeJS.Timeout | null = null;

	const incrementCount = () => {
		liveCount += 1;

		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			fetch('/?/increment', {
				method: 'POST',
				body: JSON.stringify({ count: liveCount - startCount }),
			});

			timer = null;
		}, TIMEOUT);
	};

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

		<CounterButton
			onTrigger={() => {
				incrementCount();
			}}
		/>
	</main>
</div>
