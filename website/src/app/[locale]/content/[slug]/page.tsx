import * as React from 'react';

import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { getContentMetadata, getSanitizedPageContent } from '@/strapi_data';
import { unstable_setRequestLocale } from 'next-intl/server';

export async function generateStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  let dataIt = (await getContentMetadata('pl'))?.pagesMetadata?.values();
  let data = dataIt ? [...dataIt].map((v) => v.slug) : Array<string>();

  return ['pl', 'en'].flatMap((locale) =>
    data.map((slug) => ({
      locale: locale,
      slug: slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { pagesMetadata, pagesSlugToId } = await getContentMetadata(
    params.locale,
  );

  const id = pagesSlugToId.get(params.slug);
  const title = id ? pagesMetadata.get(id)?.title : undefined;

  return { title };
}

export default async function Index({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  let locale = params.locale;
  unstable_setRequestLocale(locale);

  let slug = params.slug;
  let contentMetadata = await getContentMetadata(locale);

  let pageId = contentMetadata?.pagesSlugToId?.get(slug);

  if (!pageId) {
    notFound();
  }

  let categoryId = contentMetadata?.pagesMetadata?.get(pageId)?.categoryId;

  let categoryMetadata = categoryId
    ? contentMetadata?.categoriesMetadata?.get(categoryId)
    : undefined;

  let categoryTitle = categoryMetadata?.title ?? '';
  let numOfPages = categoryMetadata?.pagesId?.length ?? 0;

  let sanitized_content = await getSanitizedPageContent(pageId, locale);

  return (
    <span className="mx-3 mb-10 flex scroll-mt-[calc(64px+20px)] flex-col items-start md:ml-0">
      {numOfPages > 1 && categoryTitle ? (
        <div className="colors-category-on-page mb-3 ml-[2px] leading-6">
          {categoryTitle}
        </div>
      ) : (
        <React.Fragment />
      )}
      <article
        className="prose-tweaked"
        dangerouslySetInnerHTML={{ __html: sanitized_content ?? '' }}
      />
    </span>
  );
}
