import * as React from 'react';

import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getContentMetadata } from '@/strapi_data';
import { getIssuesList } from '@/strapi_data';
import { unstable_setRequestLocale } from 'next-intl/server';

import { IssuesList } from '@/types';

import ChoiceBar from '@/widgets/choice';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Metadata',
  });
  const title = {
    template: `%s | ${t('title')} – ${t('archive')}`,
    default: `${t('archive')} | ${t('title')}`,
  };

  return { title };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);

  const contentMetadata = await getContentMetadata(params.locale);
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Search',
  });
  const { list } = await getIssuesList();

  const translations = {
    search: t('search'),
    range: t('range'),
    reset: t('reset'),
    from: t('from'),
    to: t('to'),
    searchAuthors: t('authors'),
    searchTitle: t('title'),
    searchKeywords: t('keywords'),
    searchAbstract: t('abstract'),
    searchRemaining: t('remaining'),
    noResults: t('noResults'),
    dateAscending: t('dateAscending'),
    dateDescending: t('dateDescending'),
    sort: t('sort'),
    include: t('include')
  };

  if (!contentMetadata) {
    notFound();
  }

  return (
    <div className="order-[150] mx-auto flex max-w-7xl grow items-stretch">
      <div className="relative mx-[3%] flex grow flex-col items-stretch sm:mx-1.5">
        <ChoiceBar
          locale={params.locale}
          translations={translations}
          list={list}
        />
        <div className="order-5 w-full">{children}</div>
      </div>
    </div>
  );
}
