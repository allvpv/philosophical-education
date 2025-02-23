'use client';

import * as React from 'react';
import clsx from 'clsx';

import { useRef, useState, useEffect, Fragment } from 'react';
import { useParams } from 'next/navigation';

import useContainerVisible from '@/helpers/hooks/use_container_visible';
import { scrollHCenterElement } from '@/helpers/scroll_centering_element';
import NavigationItems from './navigation_items';

import { PageMetadata, CategoryMetadata } from '@/types';

export default function SidebarDefaultContent({
  pagesMetadata,
  pagesSlugToId,
  categoriesMetadata,
}: {
  pagesMetadata: Map<number, PageMetadata>;
  pagesSlugToId: Map<string, number>;
  categoriesMetadata: Map<number, CategoryMetadata>;
}) {
  const activeRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const isContainerVisible = useContainerVisible(containerRef.current);
  let currentSlug = useParams().slug;

  if (typeof currentSlug !== 'string') {
    currentSlug = currentSlug.at(-1) ?? '';
  }

  // Center the item in sidebar
  useEffect(() => {
    if (isContainerVisible && activeRef.current && containerRef.current) {
      scrollHCenterElement(containerRef.current, activeRef.current, 64, 12);
    }
  }, [currentSlug, isContainerVisible]);

  return (
    <aside
      className="hoverable:scrollbar-maclike hoverable:scrollbar-sidebar-colors sticky
        top-[calc(64px-8px)] ml-5 mr-1 hidden h-full max-h-[calc(100dvh-64px+8px)]
        w-[216px] shrink-0 overflow-x-hidden overflow-y-scroll scroll-smooth pt-[8px]
        sm:block md:top-[calc(64px-20px)] md:mr-[1rem] md:max-h-[calc(100dvh-64px+20px)]
        md:w-[232px] md:pt-[20px] lg:ml-16 lg:w-[272px]
        hoverable:[&::-webkit-scrollbar-track]:my-[8px]
        md:hoverable:[&::-webkit-scrollbar-track]:my-[20px]"
      ref={containerRef as React.RefObject<HTMLDivElement>}>
      {/* height: 0, do not try to fix that, you will break something you
          would never think about (e.g. test if sidebar height is shrinked
          when the article content is very short) */}
      <nav
        className={clsx(
          'h-0 pr-[5px] text-sm leading-6',
          'pt-[40px] md:pt-[20px]',
        )}>
        <NavigationItems
          currentSlug={currentSlug}
          pagesMetadata={pagesMetadata}
          pagesSlugToId={pagesSlugToId}
          categoriesMetadata={categoriesMetadata}
          activeRef={activeRef}
        />
        <div
          className="to-page-bg-color pointer-events-none sticky bottom-0 mt-auto h-[20px] w-[100%]
            bg-gradient-to-b from-transparent md:h-[40px]"
        />
      </nav>
    </aside>
  );
}
