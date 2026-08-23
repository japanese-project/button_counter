import type { Actions } from './$types';
import { incrementCount } from './counter.ts';

export const actions = {
	increment: async ({request}) => {
		const { count } = await request.json();
		
		if (count < 1) {
			return { success: false, message: 'Count must be at least 1' };
		}

		await incrementCount({ increment: count });
		return { success: true };
	}
} satisfies Actions;
