'use client';

import { useState, useEffect, Fragment } from 'react';
import { useTheme } from 'next-themes';
import { Listbox } from '@headlessui/react';
import { ThemeInfo } from '@/types';

import clsx from 'clsx';

type ThemeSwitcherProps = {
  themes: ThemeInfo[];
};

export default function ThemeSwitcher({ themes }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client; only when mounted, now we can show the full the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  let skeleton = (
    <div className="fix-safari flex cursor-pointer px-1 py-1">
      {themes
        .filter((theme) => theme.icon_cond_class)
        .map((theme) => (
          <div className={theme.icon_cond_class} key={`div-${theme.value}`}>
            {theme.icon}
          </div>
        ))}
    </div>
  );

  if (!mounted) {
    return (
      <div className="pointer-events-none opacity-50 transition-opacity">
        {skeleton}
      </div>
    );
  }

  return (
    <div className="opacity-100 transition-opacity">
      <Listbox
        value={theme}
        as={Fragment}
        onChange={(nextTheme) => setTheme(nextTheme)}>
        <Listbox.Button type="button" className="block">
          {skeleton}
        </Listbox.Button>
        <Listbox.Options
          className="
                 colors-border colors-dialog absolute
                 right-3 mt-0 translate-y-1 rounded-lg
                 border-2 py-1 py-2
                 text-sm font-medium tracking-tight">
          {themes.map((theme) => (
            <Listbox.Option
              key={`lst-${theme.value}`}
              value={theme.value}
              as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={clsx(
                    'py-3 pl-5 pr-8 text-base md:py-1.5 md:text-sm',
                    'flex items-center justify-start',
                    'cursor-pointer transition-colors',
                    selected && 'colors-dialog-selected',
                  )}>
                  <span
                    className={clsx(
                      'flex items-center justify-end transition-[filter]',
                      active && 'colors-amplify-filter',
                    )}>
                    <span className="pointer-events-none mr-3 w-5 md:scale-[0.90]">
                      {theme.icon}
                    </span>
                    <span>{theme.display}</span>
                  </span>
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
