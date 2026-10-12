import { useState, useEffect } from 'react';

/**
 * The current time, refreshed on every minute boundary.
 * Returns null before mount so the server and the first client render match.
 */
function useMinuteNow() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    let timeout;

    const tick = () => {
      const date = new Date();
      setNow(date);
      const msIntoMinute = date.getSeconds() * 1000 + date.getMilliseconds();
      timeout = setTimeout(tick, 60000 - msIntoMinute + 50);
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  return now;
}

export default useMinuteNow;
