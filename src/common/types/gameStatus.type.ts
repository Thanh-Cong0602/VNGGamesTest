export enum GameStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  MAINTENANCE = 'Maintenance'
}

export function getAllGameStatus(): GameStatus[] {
  return Object.values(GameStatus)
}
