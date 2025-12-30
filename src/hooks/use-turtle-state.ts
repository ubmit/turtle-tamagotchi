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
  // Don't apply decay if already dead or asleep
  if (state.isDead || state.isAsleep) {
    return { ...state, lastUpdated: Date.now() };
  }

  const elapsed = Date.now() - state.lastUpdated;
  const missedTicks = Math.floor(elapsed / DECAY_INTERVAL_MS);

  // No decay needed if no time has passed
  if (missedTicks === 0) {
    return { ...state, lastUpdated: Date.now() };
  }

  const decayAmount = missedTicks * DECAY_PER_TICK;
  const newHunger = Math.max(0, state.hunger - decayAmount);
  const newHappiness = Math.max(0, state.happiness - decayAmount);

  // Check death condition consistently
  const isDead = newHunger === 0 || newHappiness === 0;

  return {
    ...state,
    hunger: newHunger,
    happiness: newHappiness,
    isDead,
    lastUpdated: Date.now(),
  };
}

function isValidTurtleState(obj: unknown): obj is TurtleState {
  if (typeof obj !== "object" || obj === null) return false;
  const state = obj as Record<string, unknown>;
  return (
    typeof state.hunger === "number" &&
    typeof state.happiness === "number" &&
    typeof state.lastUpdated === "number" &&
    typeof state.isAsleep === "boolean" &&
    typeof state.isDead === "boolean" &&
    state.hunger >= 0 &&
    state.hunger <= MAX_STAT &&
    state.happiness >= 0 &&
    state.happiness <= MAX_STAT
  );
}

function loadState(): TurtleState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...DEFAULT_STATE, lastUpdated: Date.now() };

    const parsed = JSON.parse(saved);
    if (!isValidTurtleState(parsed)) {
      console.warn("Invalid turtle state in localStorage, using default");
      return { ...DEFAULT_STATE, lastUpdated: Date.now() };
    }

    return applyOfflineDecay(parsed);
  } catch (error) {
    console.error("Failed to load turtle state from localStorage:", error);
    return { ...DEFAULT_STATE, lastUpdated: Date.now() };
  }
}

export function useTurtleState() {
  const [state, setState] = useState<TurtleState>(loadState);

  // Debounced localStorage save (500ms delay)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...state, lastUpdated: Date.now() }),
        );
      } catch (error) {
        console.error("Failed to save turtle state to localStorage:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
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
