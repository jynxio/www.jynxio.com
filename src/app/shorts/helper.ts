/**
 * Formats an ISO date string into a human-readable date string in the local time zone.
 */
function formatDate(
    /** The ISO format date string to format */
    date: string,
    options: {
        /** The locale to use for formatting, e.g. 'en-US', defaults to 'en-US' */
        locale?: string;
        /** The timezone identifier, e.g. 'America/New_York', defaults to local system timezone */
        timeZone?: string;
    } = {},
): string {
    const { locale = 'en-US', timeZone } = options;
    const option: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone,
    };

    return new Intl.DateTimeFormat(locale, option).format(new Date(date));
}

export { formatDate };
