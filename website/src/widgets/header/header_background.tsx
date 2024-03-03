'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

const offset = 90;

export default function HeaderBackground() {
  let [isSolid, setIsSolid] = useState(true); // True by default for javascript-disabled users

  useEffect(() => {
    function onScroll() {
      setIsSolid(window.scrollY > offset);
    }

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className={clsx(
        'border-box absolute top-0 h-full w-full transition-colors duration-500',
        isSolid ? 'colors-header-solid' : 'colors-header-transparent',
      )}
    />
  );
}
