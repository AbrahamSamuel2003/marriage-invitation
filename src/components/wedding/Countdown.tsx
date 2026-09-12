import { useEffect, useState } from "react";
import { weddingData } from "@/data/weddingData";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function calculateRemaining(): Remaining {
  const distance = Math.max(0, new Date(weddingData.wedding.isoDate).getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export function Countdown() {
  const [remaining, setRemaining] = useState<Remaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setRemaining(calculateRemaining());
    const timer = window.setInterval(() => setRemaining(calculateRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="countdown-grid" aria-label="Countdown to the wedding" data-reveal>
      {Object.entries(remaining).map(([label, value]) => (
        <div key={label} className="countdown-unit">
          <div className="countdown-ring">
            <span className="countdown-value">{String(value).padStart(2, "0")}</span>
          </div>
          <small className="countdown-label">{label}</small>
        </div>
      ))}
    </div>
  );
}
