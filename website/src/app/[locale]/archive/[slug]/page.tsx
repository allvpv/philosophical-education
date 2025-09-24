import * as React from 'react';

import type { Metadata } from 'next';

import { memo } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { getIssuesList, getIssue } from '@/strapi_data';
import { ArticleWidget } from '@/widgets/tile/article';
import { IssueWidget } from '@/widgets/tile/issue';

import getMasonry from '@/widgets/masonry';

import { Article } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { slugToId, list } = await getIssuesList();

  const id = slugToId.get(
    params.slug !== 'latest' ? params.slug : list[0]?.slug,
  );
  const issue = id ? await getIssue(id) : null;
  const label = issue
    ? ((params.locale === 'pl' ? issue.label_pl : issue.label_en) ??
      issue.label_pl ??
      issue.label_en)
    : null;

  return { title: label };
}

async function getIssueFromSlug(slug: string) {
  const { slugToId, list } = await getIssuesList();

  if (!slug) {
    return notFound();
  }

  const id = slugToId.get(slug !== 'latest' ? slug : list[0]?.slug);

  if (!id) {
    return notFound();
  }

  const issue = await getIssue(id);

  if (!issue) {
    return notFound();
  }

  return issue;
}

const ArticleWidgetMemoized = memo(ArticleWidget);

export default async function ArchivePage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Article' });
  const issue = await getIssueFromSlug(slug);

  const translations: Record<string, string> = [
    'backText',
    'copiedText',
  ].reduce(
    (acc, key) => {
      acc[key] = t(key);
      return acc;
    },
    {} as Record<string, string>,
  );

  let articleWidgets = issue.articles.map((article: Article) => (
    <div
      className="min-w-[290px] max-w-[450px] pb-[6px] pt-[6px]"
      key={`${issue.label_en}-${article.number}`}>
      <ArticleWidgetMemoized
        translations={translations}
        issue={issue}
        article={article}
        locale={locale}
      />
    </div>
  ));

  let widgets = [<IssueWidget issue={issue} locale={locale} translations={translations} />]
    .concat(articleWidgets);

  return getMasonry(widgets);
}
