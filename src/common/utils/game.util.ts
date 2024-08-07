import { format, fromUnixTime, parseISO } from 'date-fns'
import { FULL_DATE_TIME_FORMAT, STANDAR_DATE_TIME_FORMAT } from '../constants/constant'
import { invalidMessages } from '../constants/message.constant'
import { GameItems } from '../types/game.type'

/**
 * Check if a game with the specified name exists in the list of games.
 *
 * @param {GameItems[]} listOfGames - An array of game objects to search through.
 * @param {string} name - The name of the game to find.
 * @returns {boolean} - Returns true if a game with the specified name is found, otherwise false.
 */
export function existByName(listOfGames: GameItems[], name: string): boolean {
  const foundGame = listOfGames.find(game => game.name === name)
  if (foundGame) return true
  return false
}

/**
 * Convert a timestamp to a datetime-local string.
 * @param {number | undefined} timestamp - The timestamp to convert.
 * @returns {string} - The formatted datetime-local string.
 */
export const getDateTimeValue = (timestamp?: number): string => {
  const date = timestamp ? fromUnixTime(timestamp) : new Date()
  return format(date, STANDAR_DATE_TIME_FORMAT)
}

/**
 * Convert a timestamp to a formatted date string.
 * @param {number} timestamp - The timestamp to convert.
 * @returns {string} - The formatted date string.
 */
export function convertTimestampToDate(timestamp?: number): string {
  if (timestamp === undefined) return invalidMessages.MSG_V0003
  const date = fromUnixTime(timestamp)
  return format(date, FULL_DATE_TIME_FORMAT)
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

export const handlePath = (url: string, path: ParamsNetwork['path']) => {
  if (!path || Object.keys(path).length <= 0) {
    return url
  }

  let resUrl = url
  Object.keys(path).forEach(k => {
    resUrl = resUrl.replaceAll(`{${k}}`, String(path[k]))

    resUrl = resUrl.replaceAll(`:${k}`, String(path[k]))
  })

  return resUrl
}

