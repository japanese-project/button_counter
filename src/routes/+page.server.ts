import type { Actions } from './$types'
import { incrementCount } from './counter.ts'

export const actions = {
	increment: async () => {
		incrementCount()
		return { success: true }
	},
} satisfies Actions
