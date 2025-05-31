'use client';
import { useEffect } from 'react';

export const ErudaProvider = () => {
  useEffect(() => {
    // Only load Eruda in development
    if (process.env.NODE_ENV === 'development') {
      import('eruda').then((eruda) => {
        eruda.default.init();
      });
    }
  }, []);

  return null;
}; 