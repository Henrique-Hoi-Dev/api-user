import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const formatWithTimezone = (date, formatStr = 'HH:mm', timeZone = 'America/Sao_Paulo') => {
    if (!date) return null;
    const zonedDate = utcToZonedTime(date, timeZone);
    return format(zonedDate, formatStr);
};
