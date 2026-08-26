import { query } from '$app/server'
import { get_count } from './counter.ts'

/**
 * @param {number} milliseconds
 * @returns
 */
function delay(milliseconds: number) {
	return new Promise(function run(resolve) {
		setTimeout(resolve, milliseconds)
	})
}

export const count_live = query.live(async function* () {
	while (true) {
		const next_count = await get_count()
		yield next_count
		await delay(500)
	}
})
