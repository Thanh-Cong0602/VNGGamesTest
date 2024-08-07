import { GameItems } from '~/types/game.type'

export function existByName(listOfGames: GameItems[], name: string): boolean {
  const foundGame = listOfGames.find(game => game.name === name)
  if (foundGame) return true
  return false
}
