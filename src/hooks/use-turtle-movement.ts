import { useState, useEffect, useCallback } from "react"

interface Position {
  x: number
  y: number
}

const MOVE_INTERVAL_MS = 3000
const TURTLE_SIZE = 128

export function useTurtleMovement(isAsleep: boolean, isDead: boolean) {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 })
  const [isMoving, setIsMoving] = useState(false)

  const getRandomPosition = useCallback(() => {
    const padding = 10
    const maxX = 100 - padding - (TURTLE_SIZE / window.innerWidth) * 100
    const maxY = 100 - padding - (TURTLE_SIZE / window.innerHeight) * 100
    return {
      x: padding + Math.random() * (maxX - padding),
      y: padding + Math.random() * (maxY - padding),
    }
  }, [])

  useEffect(() => {
    if (isAsleep || isDead) return

    const move = () => {
      setIsMoving(true)
      setPosition(getRandomPosition())
      setTimeout(() => setIsMoving(false), 1000)
    }

    const interval = setInterval(move, MOVE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isAsleep, isDead, getRandomPosition])

  return { position, isMoving }
}
