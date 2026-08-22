<script lang="ts">
	interface Props {
		onTrigger?: () => void;
		disabled?: boolean;
	}

	let { onTrigger, disabled = false }: Props = $props();

	let pressed: boolean = $state(false);
	let ledOn: boolean = $state(false);

	function handleClick(): void {
		if (disabled) return;

		ledOn = true;
		onTrigger?.();

		setTimeout((): void => {
			ledOn = false;
		}, 120);
	}
</script>

<div class="button-rim">
	<button
		type="submit"
		{disabled}
		class:pressed
		onmousedown={() => (pressed = true)}
		onmouseup={() => (pressed = false)}
		onmouseleave={() => (pressed = false)}
		ontouchstart={() => (pressed = true)}
		ontouchend={() => (pressed = false)}
		onclick={handleClick}
		aria-label="Increase counter by one"
	>
		<span class="led" class:active={ledOn}></span>
	</button>
</div>
<div
	class="rounded-3xl bg-[#1e232a] p-2.5 shadow-[inset_0_2px_4px_rgb(255_255_255/8%),0_16px_32px_rgb(0_0_0/30%)]"
>
	<button
		type="submit"
		{disabled}
		class={[
			'relative flex h-40 w-[min(288px,75vw)] cursor-pointer flex-col items-center justify-center rounded-2xl border border-stone-800 bg-[#0f1216] text-white transition-all duration-100 select-none',
			pressed
				? 'translate-y-1 scale-[0.97] shadow-inner'
				: 'shadow-[0_8px_0_#07090c,0_14px_24px_rgb(0_0_0/35%)] hover:scale-[1.015]',
			disabled && 'cursor-not-allowed opacity-50'
		]}
		onpointerdown={() => (pressed = true)}
		onpointerup={() => (pressed = false)}
		onpointerleave={() => (pressed = false)}
		onpointercancel={() => (pressed = false)}
		onclick={handleClick}
		aria-label="Increase counter by one"
	>
		<span
			class={[
				'absolute top-4 right-4 h-2.5 w-2.5 rounded-full transition-all duration-100',
				ledOn ? 'bg-white shadow-[0_0_12px_3px_white]' : 'bg-gray-600'
			]}
		>
		</span>

		<span class="text-5xl font-black tracking-wider uppercase"> Click </span>

		<span class="mt-1.5 font-mono text-xs font-bold tracking-widest text-stone-400 uppercase">
			Tactile +1
		</span>
	</button>
</div>
