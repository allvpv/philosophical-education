import * as React from 'react';

import { PageMetadata, CategoryMetadata } from '@/types';
import { useTranslations } from 'next-intl';
import SidebarMiniContent from './sidebar_mini';
import SidebarDefaultContent from './sidebar_default';

export function SidebarMini({
  pagesMetadata,
  categoriesMetadata,
  pagesSlugToId,
}: {
  pagesMetadata: Map<number, PageMetadata>;
  categoriesMetadata: Map<number, CategoryMetadata>;
  pagesSlugToId: Map<string, number>;
}) {
  return (
    <React.Fragment>
      <SidebarMiniContent
        pagesMetadata={pagesMetadata}
        categoriesMetadata={categoriesMetadata}
        pagesSlugToId={pagesSlugToId}
      />
      <div className="order-[350] h-[48px] sm:hidden" />
    </React.Fragment>
  );
}

export async function SidebarDefault({
  locale,
  pagesMetadata,
  pagesSlugToId,
  categoriesMetadata,
}: {
  locale: string;
  pagesMetadata: Map<number, PageMetadata>;
  pagesSlugToId: Map<string, number>;
  categoriesMetadata: Map<number, CategoryMetadata>;
}) {
  return (
    <SidebarDefaultContent
      pagesMetadata={pagesMetadata}
      categoriesMetadata={categoriesMetadata}
      pagesSlugToId={pagesSlugToId}
    />
  );
}

function SearchButton({ locale }: { locale: string }) {
  const t = useTranslations('Sidebar');

  return (
    <button
      className="colors-search-button flex h-8 w-full items-center rounded-lg py-1.5 pl-2 pr-3
        text-sm leading-6 drop-shadow-sb transition-colors">
      <svg
        width="24"
        height="24"
        fill="none"
        aria-hidden="true"
        className="mr-3 flex-none md:scale-90">
        <path
          d="m19 19-3.5-3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="11"
          cy="11"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="md:text-sm">{t('search')}</span>
    </button>
  );
}
