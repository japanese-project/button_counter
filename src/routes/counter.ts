import { db } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import { counter } from '../../db/schema';

const TIMEOUT = 3000;

let count: number = 0;
let started: boolean = false;
let timer: NodeJS.Timeout | null = null;

export function incrementCount() {
	count++;

	if (timer) {
		clearTimeout(timer);
	}

	timer = setTimeout(async () => {
		await db
			.update(counter)
			.set({ count: sql`${counter.count} + 1` })
			.where(eq(counter.id, 1))
			.run();

		timer = null;
	}, TIMEOUT);
}

export async function getCount() {
	if (!started) {
		const result = await db.select().from(counter).where(eq(counter.id, 1)).get();
		count = result?.count ?? 0;
		started = true;
	}

	return count;
}
