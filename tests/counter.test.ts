import { afterEach, expect, test, vi } from 'vitest';
import { get_count, increment_count } from '../src/routes/counter';

vi.mock('$lib/server/db', () => ({
	db: {
		select: () => ({
			from: () => ({
				where: () => ({ get: async () => ({ count: 0 }) })
			})
		})
	}
}));

afterEach(() => {
	vi.clearAllTimers();
	vi.useRealTimers();
});

test('incrementCount increments the count', async () => {
	vi.useFakeTimers();

	expect(await get_count()).toBe(0);

	increment_count();
	expect(await get_count()).toBe(1);

	increment_count();
	expect(await get_count()).toBe(2);

	increment_count();
	expect(await get_count()).toBe(3);
});
