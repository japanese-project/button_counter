import { db } from '$lib/server/db'
import { eq, sql } from 'drizzle-orm'
import { counter } from '../../db/schema'

const timeout_ms = 3000

let count: number = 0
let add_num: number = 0
let started: boolean = false
let timer: NodeJS.Timeout | null = null

export function increment_count() {
	add_num++

	if (timer) {
		clearTimeout(timer)
	}

	timer = setTimeout(async () => {
		await db
			.update(counter)
			.set({ count: sql`${counter.count} + ${add_num}` })
			.where(eq(counter.id, 1))
			.run()

		count += add_num

		// reset add_num and timer after the update
		add_num = 0
		timer = null
	}, timeout_ms)
}

export async function get_count() {
	if (!started) {
		const result = await db.select().from(counter).where(eq(counter.id, 1)).get()
		count = result?.count ?? 0
		started = true
	}

	return count
}
