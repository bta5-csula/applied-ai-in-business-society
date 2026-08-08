import { useEffect, useState } from "react";

export function useCounter(target, duration = 1100, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp - delay) / duration, 1);

      if (timestamp - startTimestamp >= delay) {
        setValue(Math.floor(progress * target));
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, delay]);

  return value;
}
