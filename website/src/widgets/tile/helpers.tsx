'use client';

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const getStrapiUrl = (suffix: string) => `${STRAPI_URL}${suffix}`;

export const ButtonDownload = ({ url, hasUrl, isIssueButton = false }: any) => {
  const buttonElement = (
    <button
      className={clsx(
        !isIssueButton ? "colors-button-medium" : "colors-button-issue-medium",
        'transition-color',
        !isIssueButton ? "hover:colors-button-hard" : "hover:colors-button-issue-hard",
        'flex h-[28px] w-[72px]',
        'items-center justify-evenly rounded-lg',
        'px-1.5 text-sm',
        'font-medium duration-150',
        !hasUrl && 'pointer-events-none opacity-50',
      )}>
      <IconDownload />
      <span className="mr-1">PDF</span>
    </button>
  );

  return hasUrl ? (
    <a href={getStrapiUrl(url)} target="_blank">
      {buttonElement}
    </a>
  ) : (
    <span>{buttonElement}</span>
  );
};

export const ButtonLanguage = ({
  options,
  setOption,
  localePrimary,
  localeSecondary,
  isIssueButton = false,
}: any) => {
  const isChecked = options.locale === localeSecondary;

  return (
    <Switch
      checked={isChecked}
      onChange={(checked) =>
        setOption('locale', checked ? localeSecondary : localePrimary)
      }
      className={clsx(
        'group/button relative h-[28px] w-[72px]',
        'rounded-lg font-medium transition-colors duration-[300ms] z-0',
        !isIssueButton ? 'colors-button-light' : 'colors-button-issue-light',
        !localeSecondary && 'pointer-events-none opacity-50',
      )}>
      <span
        className={clsx(
          'absolute left-0 top-0 z-20 h-[28px] w-[38px]',
          'inline-flex items-center justify-center',
          `rounded-lg transition-[transform] duration-[300ms] ease-allvpv
          will-change-transform`,
          'split-specific',
          !isIssueButton ? 'colors-button-medium' : 'colors-button-issue-medium',
          !isChecked && 'translate-x-0',
          isChecked && 'translate-x-[34px]',
          !isChecked && 'group-hover/button:translate-x-[4px]',
          isChecked && 'group-hover/button:translate-x-[30px]',
        )}>
        {localePrimary.toUpperCase()}
      </span>
      <span
        className={clsx(
          'absolute left-[38px] top-0 z-10 h-[28px] w-[30px] px-[5px]',
          'inline-flex items-center justify-center',
          'transition-[transform] duration-[300ms] ease-allvpv will-change-transform',
          !isChecked && 'translate-x-0',
          isChecked && 'translate-x-[-34px]',
        )}>
        {localeSecondary
          ? localeSecondary.toUpperCase()
          : localePrimary.toUpperCase() === 'PL'
            ? 'EN'
            : 'PL'}
      </span>
    </Switch>
  );
};

export function Abstract({ sanitized_abstract, isIssueAbstract=false }: { sanitized_abstract: string, isIssueAbstract?: boolean }) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showChevron, setShowChevron] = useState(true);
  const [showLot, setShowLot] = useState(true);

  const expandButtonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (expandButtonRef.current) {
      const ref = expandButtonRef.current;

      if (ref.scrollHeight <= ref.clientHeight * 1.5) {
        setShowChevron(false);
      }
    }
  }, []);

  return sanitized_abstract ? (
    <abstract
      className={clsx(
        'relative order-4 mt-5 block',
        showChevron && 'cursor-pointer',
        clsx(!isIssueAbstract ? "colors-abstract" : "colors-issue-abstract"),
        'rounded-b-3xl rounded-t-lg text-[0.98rem] leading-6',
        !clicked && 'unclicked',
        clicked && 'clicked',
        'group/abstract',
      )}
      onClick={() => setClicked(!clicked)}>
      {showChevron && (
        <expandbutton
          className={clsx("absolute right-0 top-0 ml-2 mr-0 flex h-[28px]",
            "w-[40px] items-center justify-center rounded-md px-1.5",
            "group-[.unclicked]/abstract:[&_circle]:opacity-0",
            !isIssueAbstract ? "colors-abstract-expandbutton" : "colors-issue-abstract-expandbutton",
            "group-[.clicked]/abstract:hoverable:[&_svg]:rotate-180")}>
          <ChevronDown />
        </expandbutton>
      )}
      <div
        className="hoverable:scrollbar-maclike hoverable:scrollbar-abstract-colors
          group-[.clicked]/abstract:overflow-y-scroll
          group-[.clicked]/abstract:overscroll-contain
          hoverable:[&::-webkit-scrollbar-track]:mb-[18px]
          hoverable:[&::-webkit-scrollbar-track]:mt-[28px]">
        <expandbuttonplaceholder className="float-right ml-2 mr-0 h-[28px] w-[40px]" />
        <textcontainer
          /* `not-supports-lh` == @supports not (height: 1lh) */
          className={clsx(
            'hoverable:scrollbar-maclike hoverable:scrollbar-sidebar-colors ml-7 mr-5',
            'block font-serif text-base transition-[max-height] duration-300 ease-allvpv',
            showChevron &&
              showLot &&
              'group-[.clicked]/abstract:max-h-[calc(10lh+16px)]',
            showChevron &&
              showLot &&
              'group-[.clicked]/abstract:not-supports-lh:max-h-[256px]',
            showChevron && 'group-[.unclicked]/abstract:max-h-[calc(2lh+16px)]',
            showChevron && 'group-[.clicked]/abstract:pr-6',
            showChevron &&
              'group-[.unclicked]/abstract:not-supports-lh:max-h-[64px]',
            showChevron &&
              'group-[.unclicked:hover]/abstract:hoverable:max-h-[calc(3lh+16px)]',
            showChevron &&
              'group-[.unclicked:hover]/abstract:hoverable:not-supports-lh:max-h-[89px]',
          )}
          ref={expandButtonRef}>
          <textpadding className="block h-[8px]" />
          <textofabstract
            dangerouslySetInnerHTML={{ __html: sanitized_abstract }}
          />
          <textpadding className="block h-[8px]" />
        </textcontainer>
      </div>
    </abstract>
  ) : (
    <div className="mb-2" />
  );
}

// Icons
export const IconDownload = () => (
  <svg
    fill="none"
    viewBox="0 0 20 20"
    strokeWidth={2.1}
    stroke="currentColor"
    className="h-4 w-4">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.5 13.75v1.875A1.875 1.875 0 0 0 4.375 17.5h11.25A1.875 1.875 0 0 0 17.5 15.625V13.75M13.75 10L10 13.75m0 0L6.25 10m3.75 3.75V2.5"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    fill="none"
    viewBox="0 0 20 20"
    strokeWidth="2"
    stroke="currentColor"
    className="h-6 w-6 transition-transform duration-[400ms]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 15 7.5 l -5 5 -5 -5"
    />
    <circle
      cx="10"
      cy="7.5"
      r="1.3"
      stroke="none"
      fill="currentColor"
      className="transition-opacity"
    />
  </svg>
);
