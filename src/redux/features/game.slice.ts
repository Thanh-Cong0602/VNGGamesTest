import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameItems } from '~/types/game.type'

type GameState = {
  games: GameItems[]
}

const initialState = {
  games: []
} as GameState

export const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    resetGames: () => initialState,
    setListOfGames: (state, action: PayloadAction<GameItems[]>) => {
      state.games = action.payload
    }
  }
})

export const { setListOfGames, resetGames } = gameSlice.actions
export default gameSlice.reducer
