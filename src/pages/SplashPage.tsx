import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SplashPage() {
  const [count, setCount] = useState(0);
  const [fading, setFading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setFading(true);
          setTimeout(() => navigate("/home"), 400);
        }, 300);
      }
    };

    requestAnimationFrame(tick);
  }, [navigate]);

  return (
    <div className={`splash${fading ? " splash-fade" : ""}`}>
      <span className="splash-count">{count}</span>
    </div>
  );
}
