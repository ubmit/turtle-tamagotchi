import { Button } from "@/components/ui/Button";

interface DeathScreenProps {
  onReset: () => void;
}

export function DeathScreen({ onReset }: DeathScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center gap-6 z-50">
      <div className="text-6xl">💀</div>
      <h2 className="text-3xl font-bold font-mono text-white">Game Over</h2>
      <p className="text-white/70 font-mono">Your turtle has died...</p>
      <Button onClick={onReset} variant="destructive" size="lg">
        Try Again
      </Button>
    </div>
  );
}
