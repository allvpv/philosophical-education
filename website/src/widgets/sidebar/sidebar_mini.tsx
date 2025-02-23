'use client';

import * as React from 'react';
import clsx from 'clsx';

import { PageMetadata, CategoryMetadata } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Popover } from '@headlessui/react';

import NavigationItems from './navigation_items';

export default function SidebarMiniContent({
  pagesMetadata,
  categoriesMetadata,
  pagesSlugToId,
}: {
  pagesMetadata: Map<number, PageMetadata>;
  categoriesMetadata: Map<number, CategoryMetadata>;
  pagesSlugToId: Map<string, number>;
}) {
  const activeRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Show the full the UI only when mounted
  useEffect(() => setMounted(true), []);

  // Center the item in sidebar
  useEffect(() => {
    let container = containerRef.current;
    let active = activeRef.current;

    if (active && container) {
      let containerRect = container.getBoundingClientRect();
      let activeRect = active.getBoundingClientRect();

      container.scrollTop =
        active.offsetTop + activeRect.height / 2 - containerRect.height / 2;
    }
  }, [pathname]);

  let slugs = useParams().slug;
  let currentSlug = typeof slugs !== 'string' ? slugs[0] : slugs;

  if (!currentSlug) {
    return <React.Fragment />;
  }

  let id = currentSlug ? pagesSlugToId.get(currentSlug) : undefined;

  if (!id) {
    return <React.Fragment />;
  }

  let metadata = pagesMetadata?.get(id);

  if (!metadata) {
    return <React.Fragment />;
  }

  let { title, categoryId } = metadata;
  let categoryMetadata = categoriesMetadata.get(categoryId);
  let pages = categoryMetadata?.pagesId;

  if (!categoryMetadata || !pages || pages.length == 0) {
    return <React.Fragment />;
  }

  let firstPageMetadata = pagesMetadata.get(pages[0]);

  if (!firstPageMetadata) {
    return <React.Fragment />;
  }

  const mergeCategoryAndSingleArticle: boolean =
    pages.length == 1 && firstPageMetadata.title == categoryMetadata.title;

  let categoryTitle = categoryMetadata.title;

  let displayCategory = (
    <span
      className="colors-miniheader ui-open:colors-miniheader-sidebar
        hover:colors-miniheader-sidebar colors-text-navbar
        ui-not-open:borders-miniheader-collapsed ui-open:borders-miniheader-expanded
        relative z-50 flex h-[48px] items-center px-[calc(2%+0.60rem)] text-sm
        backdrop-blur transition-colors duration-300 hover:cursor-pointer">
      <div
        className={clsx(
          'mr-3 scale-[0.9] transition-opacity',
          !isMounted && 'opacity-30',
        )}>
        <IconChevronDoubleUp />
      </div>
      {/* Hides category on overflow. Keep overflow-hidden on non marked (*) element */}
      <summary className="h-full w-full overflow-hidden">
        <div className="h-full w-full translate-y-1/2">
          {/* (*) */}
          <div
            className="flex flex-row-reverse flex-wrap content-start items-stretch justify-end
              gap-y-[99px]">
            <div
              className={clsx(
                '-translate-y-1/2 truncate',
                !categoryTitle && 'font-bold',
              )}>
              {title}
            </div>
            {!mergeCategoryAndSingleArticle && (
              <div className="flex -translate-y-1/2 items-center">
                <strong>{categoryTitle}</strong>
                <div className="scale-[1.3]">
                  <IconChevronRight />
                </div>
              </div>
            )}
          </div>
        </div>
      </summary>
    </span>
  );

  return (
    <Popover as={React.Fragment}>
      <Popover.Button
        as="div"
        className="fixed bottom-[0px] z-50 order-[300] flex w-full flex-col transition-transform
          duration-300 ease-[cubic-bezier(0,1,0.5,1)]
          ui-open:translate-y-[calc(-100dvh+100%+64px-1px)] sm:hidden">
        {displayCategory}
        <Popover.Overlay
          static
          className="colors-border colors-miniheader-sidebar absolute top-[48px] z-10 flex
            h-[calc(100dvh-64px-48px+1px)] w-max items-start justify-start overflow-y-scroll
            overscroll-contain scroll-smooth border-r drop-shadow-2xl backdrop-blur
            md:hidden"
          ref={containerRef}>
          <Popover.Panel static className="min-h-full max-w-[300px] px-8 pt-5">
            {({ close }) => (
              <SidebarMiniItems
                close={close}
                pagesSlugToId={pagesSlugToId}
                pagesMetadata={pagesMetadata}
                categoriesMetadata={categoriesMetadata}
                currentSlug={currentSlug}
                activeRef={activeRef}
              />
            )}
          </Popover.Panel>
        </Popover.Overlay>
      </Popover.Button>
    </Popover>
  );
}

function SidebarMiniItems({
  close,
  pagesSlugToId,
  pagesMetadata,
  categoriesMetadata,
  currentSlug,
  activeRef,
}: {
  close: () => void;
  pagesSlugToId: Map<string, number>;
  pagesMetadata: Map<number, PageMetadata>;
  categoriesMetadata: Map<number, CategoryMetadata>;
  currentSlug: string;
  activeRef: React.Ref<HTMLElement> | null;
}) {
  // Close dialog on route switch
  const pathname = usePathname();
  const [firstRun, setFirstRun] = useState(true);

  useEffect(
    () => (firstRun ? setFirstRun(false) : close()),
    [pathname, firstRun, close],
  );

  return (
    <NavigationItems
      pagesSlugToId={pagesSlugToId}
      pagesMetadata={pagesMetadata}
      categoriesMetadata={categoriesMetadata}
      currentSlug={currentSlug}
      activeRef={activeRef}
    />
  );
}

const IconChevronDoubleUp = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.0}
    stroke="currentColor"
    className="h-6 w-6 transition-transform duration-[600ms] ui-open:rotate-180">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 4.5 12.75 l 7.5 -7.5 7.5 7.5 m -15 6 l 7.5 -7.5 7.5 7.5"
    />
  </svg>
);

const IconChevronRight = () => (
  <svg
    width="3"
    height="6"
    aria-hidden="true"
    className="mx-3 overflow-visible">
    <path
      d="M 0 0 L 3 3 L 0 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);
