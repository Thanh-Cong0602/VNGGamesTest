import { format, fromUnixTime, parseISO } from 'date-fns'

export function convertTimestampToDate(timestamp: number): string {
  if (!timestamp) return 'Invalid timestamp'
  const date = fromUnixTime(timestamp)

  const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss')
  return formattedDate
}

export function convertDateToTimestamp(dateString: string): number {
  const newDate = parseISO(dateString)
  return Math.floor(newDate.getTime() / 1000)
}
