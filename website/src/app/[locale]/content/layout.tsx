import * as React from 'react';

import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';

import { getContentMetadata } from '@/strapi_data';
import { SidebarDefault, SidebarMini } from '@/widgets/sidebar';

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
    template: `%s | ${t('title')} – ${t('about')}`,
    default: `${t('about')} | ${t('title')}`,
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
  let locale = params.locale;
  unstable_setRequestLocale(locale);

  let contentMetadata = await getContentMetadata(locale);

  if (!contentMetadata) {
    notFound();
  }

  return (
    <React.Fragment>
      <div className="order-[150] mx-auto flex w-full max-w-7xl grow items-stretch">
        <div className="mx-[3%] flex grow sm:mx-1.5 md:mx-[calc(10%-4.5rem)]">
          <SidebarDefault
            locale={locale}
            pagesMetadata={contentMetadata.pagesMetadata}
            categoriesMetadata={contentMetadata.categoriesMetadata}
            pagesSlugToId={contentMetadata.pagesSlugToId}
          />
          <div className="mt-[28px] w-full max-w-3xl md:mx-[calc(11%-4.25rem)] md:mt-[40px]">
            {children}
          </div>
        </div>
      </div>
      <SidebarMini
        pagesMetadata={contentMetadata.pagesMetadata}
        categoriesMetadata={contentMetadata.categoriesMetadata}
        pagesSlugToId={contentMetadata.pagesSlugToId}
      />
    </React.Fragment>
  );
}
