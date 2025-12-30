import { useState, useEffect, useRef } from "react"

interface FoodParticle {
  id: number
  x: number
  y: number
}

interface FeedEffectProps {
  trigger: { x: number; y: number } | null
}

export function FeedEffect({ trigger }: FeedEffectProps) {
  const [particles, setParticles] = useState<FoodParticle[]>([])
  const idCounter = useRef(0)

  useEffect(() => {
    if (!trigger) return

    const newParticle: FoodParticle = {
      id: idCounter.current++,
      x: trigger.x,
      y: trigger.y,
    }

    setParticles((prev) => [...prev, newParticle])

    const timeout = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
    }, 1000)

    return () => clearTimeout(timeout)
  }, [trigger])

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none text-2xl animate-food-float"
          style={{
            left: particle.x,
            top: particle.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          🥬
        </div>
      ))}
    </>
  )
}
