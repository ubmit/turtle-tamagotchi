import { useState, useRef } from "react"
import { useTurtleState } from "@/hooks/use-turtle-state"
import { useTurtleMovement } from "@/hooks/use-turtle-movement"
import { Turtle } from "@/components/turtle/turtle"
import { FeedEffect } from "@/components/feed-effect"
import { DeathScreen } from "@/components/death-screen"
import { StatBar } from "@/components/stat-bar"
import { Button } from "@/components/ui/button"

export function App() {
  const { state, feed, play, sleep, reset } = useTurtleState()
  const { position, isMoving, moveToPosition } = useTurtleMovement(state.isAsleep, state.isDead)
  const [isEating, setIsEating] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  const [feedPosition, setFeedPosition] = useState<{ x: number; y: number } | null>(null)
  const eatingTimeout = useRef<number | null>(null)
  const happyTimeout = useRef<number | null>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    feed()
    setFeedPosition({ x: e.clientX, y: e.clientY })
    moveToPosition(e.clientX, e.clientY)
    setIsEating(true)
    if (eatingTimeout.current) clearTimeout(eatingTimeout.current)
    eatingTimeout.current = window.setTimeout(() => setIsEating(false), 500)
  }

  const handlePlay = () => {
    play()
    setIsHappy(true)
    if (happyTimeout.current) clearTimeout(happyTimeout.current)
    happyTimeout.current = window.setTimeout(() => setIsHappy(false), 600)
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* UI overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
        <h1 className="text-2xl font-bold font-mono">Turtle Tamagotchi</h1>
        <div className="flex flex-col gap-2">
          <StatBar label="Hunger" value={state.hunger} color="#22c55e" />
          <StatBar label="Happiness" value={state.happiness} color="#eab308" />
        </div>
        <Button onClick={sleep} variant="outline" disabled={state.isDead}>
          {state.isAsleep ? "Wake Up" : "Sleep"}
        </Button>
      </div>

      {/* Wandering turtle */}
      <div
        className="absolute transition-all duration-1000 ease-in-out"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Turtle
          isAsleep={state.isAsleep}
          isDead={state.isDead}
          isEating={isEating}
          isHappy={isHappy}
          isMoving={isMoving}
          onClick={handlePlay}
        />
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
        Right-click anywhere to feed
      </p>

      <FeedEffect trigger={feedPosition} />
      {state.isDead && <DeathScreen onReset={reset} />}
    </div>
  )
}

