'use client';

import { PageMetadata, CategoryMetadata } from '@/types';
import * as React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import {
  useRef,
  forwardRef,
  ReactNode,
  LegacyRef,
  useEffect,
  Fragment,
} from 'react';

type NavItemParams = {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
};

export default function NavigationItems({
  pagesMetadata,
  categoriesMetadata,
  pagesSlugToId,
  currentSlug,
  activeRef,
}: {
  pagesMetadata: Map<number, PageMetadata>;
  categoriesMetadata: Map<number, CategoryMetadata>;
  pagesSlugToId: Map<string, number>;
  currentSlug: string;
  activeRef: React.Ref<HTMLElement> | null;
}) {
  return (
    <ul>
      {[...categoriesMetadata].map(([categoryId, categoryMetadata]) => {
        let pages = categoryMetadata.pagesId;
        let isActive =
          pages.length == 1 && pagesMetadata.get(pages[0])?.slug == currentSlug;

        if (pages.length == 0) {
          return <React.Fragment key="frag" />;
        }

        let firstPageMetadata = pagesMetadata.get(pages[0]);

        if (!firstPageMetadata) {
          return <React.Fragment key="frag" />;
        }

        const mergeCategoryAndSingleArticle: boolean =
          pages.length == 1 &&
          firstPageMetadata.title == categoryMetadata.title;

        return (
          <ArticleSideBarEntry
            key={`cat-${categoryId}`}
            title={categoryMetadata.title}
            href={firstPageMetadata.slug}
            isActive={isActive}
            ref={isActive ? activeRef : undefined}>
            {mergeCategoryAndSingleArticle ? null : (
              <ul className="colors-sidebar-nav-border space-y-1 border-l-2">
                {pages
                  .map((id: number) => {
                    let pageMetadata = pagesMetadata.get(id);

                    if (!pageMetadata) {
                      return undefined;
                    }

                    let isActive = pageMetadata.slug === currentSlug;

                    return (
                      <NavItem
                        key={`page-${categoryId}-${id}`}
                        href={pageMetadata.slug}
                        isActive={isActive}
                        ref={isActive ? activeRef : undefined}>
                        {pageMetadata.title}
                      </NavItem>
                    );
                  })
                  .filter(Boolean)}
              </ul>
            )}
          </ArticleSideBarEntry>
        );
      })}
    </ul>
  );
}

const NavItem = forwardRef<HTMLElement, NavItemParams>(
  (
    { href, children, isActive }: NavItemParams,
    ref: React.LegacyRef<HTMLElement> | undefined,
  ) => {
    return (
      <li
        data-active={isActive ? 'true' : undefined}
        className="pb-2 last:pb-0"
        ref={ref as unknown as React.LegacyRef<HTMLLIElement>}>
        <Link
          scroll={true}
          href={{ pathname: href }}
          className={clsx(
            '-ml-[2px] block border-l-2 py-[2px] pl-4 transition-colors ',
            {
              'colors-nav-item-active font-semibold': isActive,
              'colors-nav-item-inactive ease-linear': !isActive,
            },
          )}>
          {children}
        </Link>
      </li>
    );
  },
);

NavItem.displayName = 'NavItem';

type ArticleSideBarEntryParams = {
  title: string;
  children: React.ReactNode;
  href: string;
  isActive: boolean;
};

const ArticleSideBarEntry = forwardRef<HTMLElement, ArticleSideBarEntryParams>(
  (
    { title, children, href, isActive }: ArticleSideBarEntryParams,
    ref: React.LegacyRef<HTMLElement> | undefined,
  ) => (
    <li className="mb-6 last-of-type:mb-0 lg:mb-8">
      <h5
        className={clsx(
          'mb-3 font-semibold',
          isActive && 'colors-nav-category-selected',
          !isActive && 'colors-nav-category',
        )}
        ref={ref as unknown as React.LegacyRef<HTMLHeadingElement>}>
        <Link href={href} scroll={true}>
          {title}
        </Link>
      </h5>
      {children}
    </li>
  ),
);

ArticleSideBarEntry.displayName = 'ArticleSideBarEntry';
