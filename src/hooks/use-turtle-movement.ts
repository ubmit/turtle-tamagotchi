import { useState, useEffect, useCallback, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

const MOVE_INTERVAL_MS = 5000;
const MOVE_DURATION_MS = 2000;
const TURTLE_SIZE = 128;

export function useTurtleMovement(isAsleep: boolean, isDead: boolean) {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const getRandomPosition = useCallback(() => {
    const padding = 10;
    const maxX = 100 - padding - (TURTLE_SIZE / window.innerWidth) * 100;
    const maxY = 100 - padding - (TURTLE_SIZE / window.innerHeight) * 100;
    return {
      x: padding + Math.random() * (maxX - padding),
      y: padding + Math.random() * (maxY - padding),
    };
  }, []);

  const startRandomMovement = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const move = () => {
      setIsMoving(true);
      setPosition(getRandomPosition());
      setTimeout(() => setIsMoving(false), MOVE_DURATION_MS);
    };

    intervalRef.current = window.setInterval(move, MOVE_INTERVAL_MS);
  }, [getRandomPosition]);

  const moveToPosition = useCallback(
    (targetX: number, targetY: number) => {
      if (isAsleep || isDead) return;

      const x = (targetX / window.innerWidth) * 100;
      const y = (targetY / window.innerHeight) * 100;

      setIsMoving(true);
      setPosition({ x, y });
      setTimeout(() => setIsMoving(false), MOVE_DURATION_MS);

      // Reset random movement timer
      startRandomMovement();
    },
    [isAsleep, isDead, startRandomMovement],
  );

  useEffect(() => {
    if (isAsleep || isDead) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    startRandomMovement();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAsleep, isDead, startRandomMovement]);

  return { position, isMoving, moveToPosition };
}
