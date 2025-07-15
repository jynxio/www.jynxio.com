import { describe, expect, it } from 'vitest';
import { formatDate } from './format-date';

describe('formatDate', () => {
    const iso = '2024-03-15T00:00:00Z';

    it('formats using default locale when only date is provided', () => {
        const result = formatDate(iso, { timeZone: 'UTC' });
        expect(result).toBe('March 15, 2024');
    });

    it('honours custom locale', () => {
        const result = formatDate(iso, { locale: 'de-DE', timeZone: 'UTC' });
        expect(result).toBe('15. März 2024');
    });

    it('honours custom timeZone', () => {
        const utc = formatDate(iso, { locale: 'en-US', timeZone: 'UTC' });
        const ny = formatDate(iso, { locale: 'en-US', timeZone: 'America/New_York' });
        const tokyo = formatDate(iso, { locale: 'en-US', timeZone: 'Asia/Tokyo' });

        expect(utc).toBe('March 15, 2024');
        expect(ny).toBe('March 14, 2024');
        expect(tokyo).toBe('March 15, 2024');
    });

    it('throws RangeError for an invalid ISO string', () => {
        expect(() => formatDate('not-a-date')).toThrowError(RangeError);
    });
});
