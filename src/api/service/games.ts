import { ENDPOINTS } from '~/api/endpoints'
import API from '~/api/instance'
import { GameItems } from '~/types/game.type'
import { handlePath } from '../helper'

export const gamesApi = {
  getAllGames() {
    return API.get(ENDPOINTS.GAMES)
  },
  getGameById(id: string) {
    return API.get(handlePath(ENDPOINTS.GAME_BY_ID, { id }))
  },
  createGame(body: GameItems) {
    return API.post(ENDPOINTS.GAMES, body)
  },
  updateGame(id: string, body: GameItems) {
    return API.put(handlePath(ENDPOINTS.GAME_BY_ID, { id }), body)
  },
  deleteGame(id: string) {
    return API.delete(handlePath(ENDPOINTS.GAME_BY_ID, { id }))
  }
}
