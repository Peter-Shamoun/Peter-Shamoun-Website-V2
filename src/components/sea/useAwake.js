import { useEffect, useRef, useState } from 'react';

/**
 * True while the element is on screen (with a margin), so its loops can stop when it is not.
 * Returns [ref, awake]. Without IntersectionObserver it is always awake.
 */
const useAwake = (margin = '120px') => {
  const ref = useRef(null);
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setAwake(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setAwake(entry.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, awake];
};

export default useAwake;
