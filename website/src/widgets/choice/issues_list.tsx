'use client';

import clsx from 'clsx';
import Link from 'next/link';
import * as React from 'react';

import { IssueStub } from '@/types';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { scrollVCenterElement } from '@/helpers/scroll_centering_element';

export default function IssuesList({
  list,
  locale,
  latestSlug,
}: {
  list: IssueStub[];
  locale: string;
  latestSlug: string;
}) {
  let slug = useParams().slug;

  if (slug === 'latest') {
    slug = latestSlug;
  }

  let [leftButtonVisible, setLeftButtonVisible] = useState(false);
  let [rightButtonVisible, setRightButtonVisible] = useState(false);

  const scrolledListRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLElement>(null);

  const showRightButtonOffset = 20;

  // Center the item in the ChoiceBar.
  useEffect(() => {
    if (activeRef.current && scrolledListRef.current) {
      scrollVCenterElement(scrolledListRef.current, activeRef.current);
    }
  }, [slug, list]);

  // Show/hide `<<`, `>>` buttons, depending on the scroll position and content.
  useEffect(() => {
    function onScroll() {
      if (scrolledListRef.current) {
        const obj = scrolledListRef.current;
        const isScrollable = obj.scrollWidth > obj.clientWidth;

        if (isScrollable) {
          setLeftButtonVisible(obj.scrollLeft > 0);
          setRightButtonVisible(
            obj.scrollLeft + obj.offsetWidth + showRightButtonOffset <
              obj.scrollWidth,
          );
        } else {
          setLeftButtonVisible(false);
          setRightButtonVisible(false);
        }
      }
    }

    if (scrolledListRef.current) {
      onScroll();

      scrolledListRef.current.addEventListener('scroll', onScroll, {
        passive: true,
      });
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [scrolledListRef, list]);

  const farJmpLeft = () => {
    if (scrolledListRef.current) {
      scrolledListRef.current.scrollLeft = 0;
    }
  };

  const farJmpRight = () => {
    if (scrolledListRef.current) {
      scrolledListRef.current.scrollLeft = scrolledListRef.current.scrollWidth;
    }
  };

  const nearJmp = (direction: string) => {
    if (scrolledListRef.current) {
      const { left, right } = scrolledListRef.current.getBoundingClientRect();
      const width = right - left;
      const step = width / 2;

      scrolledListRef.current.scrollBy({
        top: 0,
        left: direction === 'right' ? step : -step,
        behavior: 'smooth',
      });
    }
  };

  return list.length > 0 ? (
    <div
      className="relative flex h-12 grow items-stretch overflow-visible
                 transition-[height]">
      {leftButtonVisible && (
        <>
          <ScrollButton
            direction="left"
            appendClass="relative z-10 -ml-2 sm:ml-0"
            farJmp={farJmpLeft}
            nearJmp={() => nearJmp('left')}
          />
          <ScrollGradient
            direction="left"
            appendClass="mr-auto relative z-[9]"
          />
        </>
      )}
      <div
        className="no-scrollbars absolute bottom-0 left-0 top-0 flex
                   h-12 w-full items-center overflow-x-scroll"
        ref={scrolledListRef as any}>
        <div className="flex w-0 grow">
          <React.Fragment>
            {list.map((issue: IssueStub) => {
              const label =
                locale === 'pl'
                  ? issue.label_pl ?? issue.label_en
                  : issue.label_en ?? issue.label_pl;

              return (
                <Link
                  className={clsx(
                    'mx-1 my-1 whitespace-nowrap rounded-lg px-[13px] py-[3px] text-base font-medium',
                    issue.slug !== slug
                      ? 'colors-issue-button'
                      : 'colors-issue-button-active',
                  )}
                  ref={(issue.slug !== slug ? undefined : activeRef) as any}
                  key={issue.slug}
                  href={issue.slug}>
                  {label}
                </Link>
              );
            })}
          </React.Fragment>
        </div>
      </div>
      {rightButtonVisible && (
        <>
          <ScrollGradient
            direction="right"
            appendClass="ml-auto relative z-[9]"
          />
          <ScrollButton
            direction="right"
            appendClass="relative z-10"
            farJmp={farJmpRight}
            nearJmp={() => nearJmp('right')}
          />
        </>
      )}
    </div>
  ) : (
    <div className="h-0 transition-[height]" />
  );
}

const ScrollButton = ({
  direction,
  single,
  appendClass = '',
  farJmp,
  nearJmp,
}: any) => (
  <div
    className={
      `w-max-content group flex h-full items-center ` +
      `justify-center ${appendClass} colors-choice-chevron-bg overflow-visible ` +
      (direction === `left` ? `flex-row-reverse` : ``)
    }>
    <button
      className={
        `hover:colors-choice-chevron-hover h-10 rounded-full sm:h-12 ` +
        `-mr-2 flex items-center justify-center overflow-visible ` +
        `transition-[width,opacity] duration-[150ms] ` +
        `pointer-events-none group-hover:animate-[enable-pointer-events_160ms_forwards] ` +
        `w-0 opacity-0 group-hover:w-10 group-hover:opacity-100 sm:group-hover:w-12`
      }
      onClick={nearJmp}>
      <span>
        <Chevron
          direction={direction}
          single={true}
          className="colors-choice-chevron h-5 w-5"
        />
      </span>
    </button>
    <button
      className={
        `hover:colors-choice-chevron-hover h-10 w-10 rounded-full sm:h-12 sm:w-12 ` +
        `flex items-center justify-center overflow-visible`
      }
      onClick={farJmp}>
      <Chevron
        direction={direction}
        single={single}
        className="colors-choice-chevron h-5 w-5"
      />
    </button>
  </div>
);

const ScrollGradient = ({ direction, appendClass = '' }: any) => {
  const gradientDir =
    direction == 'left' ? 'bg-gradient-to-l' : 'bg-gradient-to-r';

  return (
    <data
      className={
        `colors-choice-gradient h-full w-8 from-transparent sm:w-16 xs:w-12 ` +
        `pointer-events-none ${gradientDir} ${appendClass}`
      }
    />
  );
};

const DirectionString = ['up', 'left', 'down', 'right'] as const;

const Chevron = ({
  direction,
  className,
  single,
}: {
  direction: (typeof DirectionString)[number];
  className: string;
  single: boolean | undefined;
}) => {
  let rotate =
    direction == 'up'
      ? 'rotate-270'
      : direction == 'left'
        ? 'rotate-180'
        : direction == 'down'
          ? 'rotate-90'
          : 'rotate-0';

  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.0}
      stroke="currentColor"
      className={`${className} ${rotate}`}>
      {single ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
        />
      )}
    </svg>
  );
};
