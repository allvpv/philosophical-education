'use client';

import { useState, useEffect, PropsWithChildren } from 'react';
import { useTheme } from 'next-themes';

import clsx from 'clsx';

export default function MonoToggle({ children }: PropsWithChildren<{}>) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // useEffect only runs on the client; only when mounted, now we can show the full the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="pointer-events-none opacity-50 transition-opacity">
        {children}
      </div>
    );
  }

  const mySetTheme = () => {
    resolvedTheme === 'light' && setTheme('bw');
    resolvedTheme === 'dark' && setTheme('wb');
    resolvedTheme === 'bw' && setTheme('light');
    resolvedTheme === 'wb' && setTheme('dark');
  };

  return (
    <div
      className="fix-safari cursor-pointer opacity-100 transition-opacity"
      onClick={mySetTheme}>
      {children}
    </div>
  );
}
