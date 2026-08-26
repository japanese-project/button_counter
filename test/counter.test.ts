import { afterEach, expect, test, vi } from 'vitest';
import { getCount, incrementCount } from '../src/routes/counter';

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

	expect(await getCount()).toBe(0);

	incrementCount();
	expect(await getCount()).toBe(1);

	incrementCount();
	expect(await getCount()).toBe(2);

	incrementCount();
	expect(await getCount()).toBe(3);
});
