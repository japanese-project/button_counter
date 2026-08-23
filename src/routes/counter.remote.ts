import { query } from '$app/server';
import { counter } from '../../db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

async function getCount(): Promise<number> {
	const result = await db.select().from(counter).where(eq(counter.id, 1)).get();
	return result?.count ?? 0;
}

export const countLive = query.live(async function* () {
	let lastCount: number | undefined;

	while (true) {
		const nextCount = await getCount();

		if (nextCount !== lastCount) {
			lastCount = nextCount;
			yield nextCount;
		}

		await new Promise((resolve) => setTimeout(resolve, 500));
	}
});
