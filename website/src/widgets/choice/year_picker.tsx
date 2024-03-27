'use client';

import * as React from 'react';
import clsx from 'clsx';
import { useRef, useEffect, useCallback } from 'react';

function YearRange({
  yearList,
  pickedYear,
  setPickedYear
}: {
  yearList: number[];
  pickedYear: number;
  setPickedYear: (input: number) => void;
}) {
  const pickedIndex = yearList.indexOf(pickedYear);
  const containerRef = useRef<HTMLElement>(null);

  const paddingHeight = 100;
  const elementHeight = 40;

  const getScrollTopFromPickedIndex = (index: number, height: number) => {
    const scrollElementMiddle = index * elementHeight + elementHeight / 2;
    const scrollMiddle = scrollElementMiddle + paddingHeight;
    const scrollTop = scrollMiddle - height / 2;

    return scrollTop;
  };

  const getPickedIndexFromScrollTop = (scrollTop: number, height: number) => {
      const scrollMiddle = scrollTop + height / 2;
      const scrollElementMiddle = scrollMiddle - paddingHeight;
      return Math.floor(scrollElementMiddle / elementHeight)
  }


  const scrollToPickedIndex = useCallback(
    (index: number) => {

      if (containerRef.current) {
        const { height } = containerRef.current.getBoundingClientRect();
        const currentScrollTop = containerRef.current.scrollTop;
        const currentScrollMiddle = currentScrollTop + height / 2;
        const currentScrollElementMiddle = currentScrollMiddle - paddingHeight;
        const currentIndex = (currentScrollElementMiddle - elementHeight / 2) / elementHeight;

        if (currentIndex != index) {
        const scrollTop = getScrollTopFromPickedIndex(index, height);
        containerRef.current.scrollTop = scrollTop;
        }
      }
    },
    [containerRef],
  );

  useEffect(() => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect();
      const index = getPickedIndexFromScrollTop(containerRef.current.scrollTop, height);

      if (index !== pickedIndex) {
        scrollToPickedIndex(pickedIndex);
      }
    }
  });

  // Center the item in sidebar
  const handleScroll = () => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect();
      const index = getPickedIndexFromScrollTop(containerRef.current.scrollTop, height);

      if (index !== pickedIndex) {
        setPickedYear(yearList[index]);
      }
    }
  };

  // Intercept KeyUp and KeyDown
  const handleKey = (e: any) => {
    e.preventDefault();

    if (e.key === 'ArrowDown') {
      scrollToPickedIndex(pickedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      scrollToPickedIndex(pickedIndex - 1);
    }
  };

  return (
    <div
      className="mr-3 h-[240px] cursor-default snap-y snap-mandatory
                 overflow-auto overscroll-none sm:mr-5"
      ref={containerRef as React.LegacyRef<HTMLDivElement>}
      onScroll={handleScroll}
      onKeyDown={handleKey}
      tabIndex={0}>
      <div className="h-[100px]" key={-1} />
      {yearList.map(currentYear => {
        return (
          <div
            className={clsx(
              'relative z-30 flex h-[40px] snap-center items-center',
              'my-0 mr-2 justify-center rounded-lg pl-2 tracking-wider sm:mr-6',
              'colors-issue-button-inactive font-semibold',
            )}
            key={currentYear}>
            {currentYear}
          </div>
        );
      })}
      <div className="h-[100px]" key={-2} />
    </div>
  );
}

export function YearPicker(params: {
  minYear: number;
  maxYear: number;
  selectedFrom: number;
  selectedTo: number;
  setSelectedFrom: (input: number) => void;
  setSelectedTo: (input: number) => void;
  editionsCount: number;
  locale: string;
  translations: Record<string, string>;
}) {
  let {
    minYear,
    maxYear,
    selectedFrom,
    selectedTo,
    setSelectedFrom,
    setSelectedTo,
    editionsCount,
    locale,
    translations,
  } = params;

  const getEditionsCountSuffixInLanguage = (count: number) => {
    if (locale === 'pl') {
      if (count == 1) {
        return 'numer';
      } else if (
        Math.floor(count / 10) != 1 &&
        count % 10 >= 2 &&
        count % 10 <= 4
      ) {
        return 'numery';
      } else {
        return 'numerów';
      }
    } else {
      if (count == 1) {
        return 'issue';
      } else {
        return 'issues';
      }
    }
  };

  const yearListFull = [...Array(maxYear - minYear + 1).keys()].map(
    (i) => i + minYear,
  );
  const yearList = yearListFull.filter((year) => {
    if (year > minYear + 1 && year < maxYear - 1) {
      return !((year - minYear) % 2);
    } else {
      return true;
    }
  });

  return (
    <div
      className="colors-year-picker-default relative flex min-h-[240px] items-center
                 justify-center">
      <div
        className="pointer-events-none absolute bottom-0 left-0
                   top-0 z-40 flex w-full flex-col items-stretch justify-between">
        <div className="colors-year-picker-disappear-gradient h-[30px] w-full bg-gradient-to-t sm:h-[60px]" />
        <div className="colors-year-picker-disappear-gradient h-[40px] w-full bg-gradient-to-b sm:h-[60px]" />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 flex w-full flex-col
                   items-center justify-center">
        <div className="colors-year-picker-selected-area h-[40px] w-full max-w-[500px] rounded-xl" />
      </div>
      <div className="relative z-20 mr-2">{translations['from']}</div>
      <YearRange
        yearList={yearList}
        setPickedYear={setSelectedFrom}
        pickedYear={selectedFrom}
      />
      <div className="relative z-20 mr-2">{translations['to']}</div>
      <YearRange
        yearList={yearList}
        setPickedYear={setSelectedTo}
        pickedYear={selectedTo}
      />
      <div className="relative z-20 w-[90px] whitespace-nowrap ">
        ({editionsCount} {getEditionsCountSuffixInLanguage(editionsCount)})
      </div>
    </div>
  );
}
