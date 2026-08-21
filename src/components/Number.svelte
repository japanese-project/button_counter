<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		count: number;
	}

	let { count }: Props = $props();
</script>

<div class="grid min-h-40 w-full place-items-center overflow-hidden select-none">
	{#key count}
		<div
			class="col-start-1 row-start-1 font-mono text-[clamp(6rem,18vw,10rem)] leading-none font-black tracking-tight text-gray-900 will-change-transform"
			in:fly={{
				y: -30,
				duration: 300,
				easing: cubicOut
			}}
			out:fly={{
				y: 30,
				duration: 200,
				easing: cubicOut
			}}
		>
			{count.toLocaleString()}
		</div>
	{/key}
</div>
