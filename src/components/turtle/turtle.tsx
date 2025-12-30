import "./turtle.css"

interface TurtleProps {
  isAsleep: boolean
  isDead: boolean
  isEating: boolean
  isHappy: boolean
  isMoving?: boolean
  onClick: () => void
}

export function Turtle({
  isAsleep,
  isDead,
  isEating,
  isHappy,
  isMoving,
  onClick,
}: TurtleProps) {
  const getState = () => {
    if (isDead) return "dead"
    if (isAsleep) return "sleeping"
    if (isEating) return "eating"
    if (isHappy) return "happy"
    if (isMoving) return "walking"
    return "idle"
  }

  return (
    <div className="turtle-container" onClick={onClick}>
      <div className={`turtle turtle--${getState()}`}>
        {/* Shell */}
        <div className="turtle__shell" />
        {/* Head */}
        <div className="turtle__head">
          <div className="turtle__eye turtle__eye--left" />
          <div className="turtle__eye turtle__eye--right" />
        </div>
        {/* Legs */}
        <div className="turtle__leg turtle__leg--fl" />
        <div className="turtle__leg turtle__leg--fr" />
        <div className="turtle__leg turtle__leg--bl" />
        <div className="turtle__leg turtle__leg--br" />
        {/* Tail */}
        <div className="turtle__tail" />
      </div>
      {isAsleep && <div className="turtle__zzz">💤</div>}
      {isDead && <div className="turtle__dead">✕</div>}
    </div>
  )
}
