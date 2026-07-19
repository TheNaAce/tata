import { useEffect, useState } from 'react';

interface CountUpNumberProps {
  target: number;
  decimals?: number;
  duration?: number; // duration in ms
  trigger: boolean;
}

export function CountUpNumber({ target, decimals = 0, duration = 1500, trigger }: CountUpNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * target;
      
      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration, trigger]);

  return <span>{count.toFixed(decimals)}</span>;
}
