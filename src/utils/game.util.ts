import { GameItems } from '~/types/game.type'

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
