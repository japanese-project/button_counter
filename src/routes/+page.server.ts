import type { Actions } from './$types'
import { increment_count } from './counter.ts'

export const actions = {
	increment: async () => {
		increment_count()
		return { success: true }
	},
} satisfies Actions
