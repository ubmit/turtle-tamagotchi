import { useState, useEffect, useCallback } from "react";
import {
  DECAY_INTERVAL_MS,
  DECAY_PER_TICK,
  FEED_AMOUNT,
  PLAY_BOOST,
  MAX_STAT,
  STORAGE_KEY,
  DEFAULT_STATE,
} from "@/lib/constants";

export interface TurtleState {
  hunger: number;
  happiness: number;
  lastUpdated: number;
  isAsleep: boolean;
  isDead: boolean;
}

function applyOfflineDecay(state: TurtleState): TurtleState {
  if (state.isDead || state.isAsleep) return state;

  const elapsed = Date.now() - state.lastUpdated;
  const missedTicks = Math.floor(elapsed / DECAY_INTERVAL_MS);
  const decayAmount = missedTicks * DECAY_PER_TICK;

  const newHunger = Math.max(0, state.hunger - decayAmount);
  const newHappiness = Math.max(0, state.happiness - decayAmount);
  const isDead = newHunger === 0 || newHappiness === 0;

  return {
    ...state,
    hunger: newHunger,
    happiness: newHappiness,
    isDead,
    lastUpdated: Date.now(),
  };
}

function loadState(): TurtleState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...DEFAULT_STATE, lastUpdated: Date.now() };

  const parsed = JSON.parse(saved) as TurtleState;
  return applyOfflineDecay(parsed);
}

export function useTurtleState() {
  const [state, setState] = useState<TurtleState>(loadState);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, lastUpdated: Date.now() }),
    );
  }, [state]);

  // Active decay while tab is open (skip if sleeping or dead)
  useEffect(() => {
    if (state.isAsleep || state.isDead) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const newHunger = Math.max(0, prev.hunger - DECAY_PER_TICK);
        const newHappiness = Math.max(0, prev.happiness - DECAY_PER_TICK);
        const isDead = newHunger === 0 || newHappiness === 0;

        return {
          ...prev,
          hunger: newHunger,
          happiness: newHappiness,
          isDead,
        };
      });
    }, DECAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [state.isAsleep, state.isDead]);

  const feed = useCallback(() => {
    setState((prev) => {
      if (prev.isDead) return prev;
      return {
        ...prev,
        hunger: Math.min(MAX_STAT, prev.hunger + FEED_AMOUNT),
      };
    });
  }, []);

  const play = useCallback(() => {
    setState((prev) => {
      if (prev.isDead) return prev;
      return {
        ...prev,
        happiness: Math.min(MAX_STAT, prev.happiness + PLAY_BOOST),
      };
    });
  }, []);

  const sleep = useCallback(() => {
    setState((prev) => {
      if (prev.isDead) return prev;
      return { ...prev, isAsleep: !prev.isAsleep };
    });
  }, []);

  const reset = useCallback(() => {
    setState({ ...DEFAULT_STATE, lastUpdated: Date.now() });
  }, []);

  return { state, feed, play, sleep, reset };
}
