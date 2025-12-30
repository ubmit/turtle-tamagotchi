export const DECAY_INTERVAL_MS = 10_000
export const DECAY_PER_TICK = 1
export const FEED_AMOUNT = 5
export const PLAY_BOOST = 10
export const MAX_STAT = 100
export const STORAGE_KEY = "turtle-tamagotchi-state"

export const DEFAULT_STATE = {
  hunger: MAX_STAT,
  happiness: MAX_STAT,
  lastUpdated: Date.now(),
  isAsleep: false,
  isDead: false,
}
