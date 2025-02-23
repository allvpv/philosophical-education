'use client';

import { PropsWithChildren } from 'react';
import { Listbox } from '@headlessui/react';

import { useRouter, usePathname } from '@/i18n/routing';
import { useState, useEffect, useTransition, Fragment } from 'react';

export type LocaleType = 'pl' | 'en' | undefined;

export default function LocaleSwitcher({
  children,
  fullNames,
  currentLocale,
}: PropsWithChildren<{
  fullNames: Record<string, string>;
  currentLocale: LocaleType;
}>) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Show the full the UI only when mounted (when we can do the locale switch)
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

  function onSelectChange(nextLocale: LocaleType) {
    router.replace(pathname, { locale: nextLocale /*, scroll: false*/ });
  }

  return (
    <div className="opacity-100 transition-opacity">
      <Listbox value={currentLocale} onChange={onSelectChange}>
        <Listbox.Button type="button" className="block">
          {children}
        </Listbox.Button>
        <Listbox.Options
          className="colors-dialog absolute mt-0 translate-y-1 rounded-lg border-2 py-1 py-3 pl-4
            pr-6 text-sm font-normal tracking-tight">
          {Object.entries(fullNames).map(([value, fullName]) => (
            <Listbox.Option key={value} value={value} as={Fragment}>
              <li
                className="ui-active:colors-amplify-filter flex cursor-pointer items-center justify-start
                  py-3 pl-1 pr-2 text-base transition-[filter] md:py-1.5 md:text-sm">
                <span className="mr-[7px] h-3 w-3">
                  <IconDiamond />
                </span>
                <span>{`${value.toUpperCase()} – ${fullName}`}</span>
              </li>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}

const IconDiamond = () => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      className="fill-current opacity-0 ui-selected:opacity-100"
      d="M 8 4 L 12 8 L 8 12 L 4 8 L 8 4 Z"
    />
  </svg>
);
