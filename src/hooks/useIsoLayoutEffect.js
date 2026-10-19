import { useEffect, useLayoutEffect } from 'react';

// useLayoutEffect in the browser, useEffect during Gatsby's server render (where layout effects
// warn and never run).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsoLayoutEffect;
