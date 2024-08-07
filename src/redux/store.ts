import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import gameReducer from './features/game.slice';

const rootReducer = combineReducers({
  gameReducer
})

const persistConfig = {
  key: 'vnggamesTest',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
})

const persistor = persistStore(store)
export { persistor, store };

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
