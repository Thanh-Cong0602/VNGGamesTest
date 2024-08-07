import { format, fromUnixTime, parseISO } from 'date-fns'

/**
 * Convert a timestamp to a datetime-local string.
 * @param {number | undefined} timestamp - The timestamp to convert.
 * @returns {string} - The formatted datetime-local string.
 */
export const getDateTimeValue = (timestamp?: number): string => {
  const date = timestamp ? fromUnixTime(timestamp) : new Date()
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

/**
 * Convert a timestamp to a formatted date string.
 * @param {number} timestamp - The timestamp to convert.
 * @returns {string} - The formatted date string.
 */
export function convertTimestampToDate(timestamp?: number): string {
  if (timestamp === undefined) return 'Invalid timestamp'
  const date = fromUnixTime(timestamp)
  return format(date, 'dd/MM/yyyy HH:mm:ss')
}

/**
 * Convert a date string to a timestamp.
 * @param {string} dateString - The date string to convert.
 * @returns {number} - The corresponding timestamp.
 */
export function convertDateToTimestamp(dateString: string): number {
  const newDate = parseISO(dateString)
  return Math.floor(newDate.getTime() / 1000)
}
