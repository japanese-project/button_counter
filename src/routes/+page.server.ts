import { db } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import { counter } from '../../db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await db.select().from(counter).where(eq(counter.id, 1)).get();
	return { count: result?.count };
};

export const actions = {
	increment: async () => {
		await db
			.update(counter)
			.set({ count: sql`${counter.count} + 1` })
			.where(eq(counter.id, 1))
			.run();
		return { success: true };
	}
} satisfies Actions;
