import { query } from '$app/server'
import { getCount } from './counter.ts'

/**
 * @param {number} milliseconds
 * @returns
 */
function delay(milliseconds: number) {
	return new Promise(function run(resolve) {
		setTimeout(resolve, milliseconds)
	})
}

export const countLive = query.live(async function* () {
	while (true) {
		const nextCount = await getCount()
		yield nextCount
		await delay(500)
	}
})
