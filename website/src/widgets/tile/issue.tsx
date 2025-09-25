'use client';

import clsx from 'clsx';
import * as React from 'react';
import { Issue } from '@/types';
import { ButtonDownload, ButtonLanguage, Abstract } from './helpers';

import useOptions from '@/helpers/hooks/use_options';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const getStrapiUrl = (suffix: string) => `${STRAPI_URL}${suffix}`;

function IssueButtons({
  options,
  setOption,
  localePrimary,
  localeSecondary,
  downloadUrl,
  hasUrl,
}: any) {
  return (
    <figure className="float-right mb-2 ml-3 mt-1 pr-5 text-sm">
      <div className="flex flex-col justify-center gap-2">
        <ButtonLanguage
          options={options}
          setOption={setOption}
          localePrimary={localePrimary}
          localeSecondary={localeSecondary}
          isIssueButton={true}
        />
        <ButtonDownload url={downloadUrl} hasUrl={hasUrl} isIssueButton={true} />
      </div>
    </figure>
  );
}

export function IssueWidget({
  locale,
  issue,
  translations,
}: {
  locale: string;
  issue: Issue;
  translations: Record<string, string>;
}) {

  const [localePrimary, localeSecondary] = (() => {
    return [locale, locale === 'pl' ? 'en' : 'pl'];
  })();

  const [options, setOption] = useOptions({
    locale: localePrimary,
  });

  function getLocalized(field: string) {
    const primary = `${field}_${options.locale}`;
    const fallback = `${field}_${options.locale === 'pl' ? 'en' : 'pl'}`;
    return (issue as any)[primary] ?? (issue as any)[fallback];
  }

  const downloadUrl = issue?.pdfUrl;
  const hasUrl = !!downloadUrl;

  return (
    <div className="flex flex-col colors-issue-widget rounded-3xl overflow-hidden">
      <div className="block pt-4 pl-4 pb-1 pr-0 leading-tight">
        <IssueButtons
          options={options}
          setOption={setOption}
          localePrimary={localePrimary}
          localeSecondary={localeSecondary}
          downloadUrl={downloadUrl}
          hasUrl={hasUrl}
          getLocalized={getLocalized}
        />
        <div className="pt-2 px-4 pr-7 block grow">
          <IssueMetadata issue={issue} options={options} getLocalized={getLocalized} />
        </div>
      </div>
    <IssueDescription issue={issue} options={options} getLocalized={getLocalized} />
    </div>
  );
}

function IssueMetadata({ issue, options, getLocalized }: any) {
  const articlesCount = issue.articles?.length || 0;
  const editedBy = issue.edited_by || (
    options.locale == 'pl' ? 'Zespół Edukacji Filozoficznej' : 'Philosophical Education'
  );

  const getArticlesCountSuffixInLanguage = (count: number) => {
    if (options.locale === 'pl') {
      if (count == 1) {
        return 'artykuł';
      } else if (
        Math.floor(count / 10) % 10 != 1 &&
        count % 10 >= 2 &&
        count % 10 <= 4
      ) {
        return 'artykuły';
      } else {
        return 'artykułów';
      }
    } else {
      if (count == 1) {
        return 'article';
      } else {
        return 'articles';
      }
    }
  };

  const description = getLocalized('short_description');

  const hasDescription = !!description;

  const labelLocalized = getLocalized('label');

  const WithUrlWrapper = ({ children }: any) => {
    return issue.pdfUrl ? <a href={getStrapiUrl(issue.pdfUrl)} target="_blank">{children}</a> : <>{children}</>;
  };

  return hasDescription ?
    (
      <div className="order-1 colors-title-issue">
          <span className={
              clsx("font-semibold text-lg/6 decoration-[3px] colors-title-issue underline",
                   issue.pdfUrl ? "colors-decoration-issue" : null)
          }>
            <WithUrlWrapper>{description}</WithUrlWrapper>
          </span>
          <div className="colors-issue-metadata text-base/5 mt-4">
            {options.locale === 'pl' ? 'Tom ' : 'Volume '}
            <span className={clsx(!hasDescription && "font-semibold")}>
              {labelLocalized}
            </span>
            {" • "}
            {articlesCount}{' '}{getArticlesCountSuffixInLanguage(articlesCount)}
          </div>
          <div className="colors-issue-metadata text-base/5 mt-4">
          {issue.edited_by ?
            <>
              {options.locale === 'pl' ? 'Redakcja: ' : 'Edited by: '}{' '}
              <span className="font-bold">{editedBy}</span>
              </>
              : null
          }
          </div>
      </div>
    ) : (
      <div className="order-1 colors-title-issue">
          <span className={
            clsx("font-normal text-lg/6 decoration-[3px] colors-title-issue underline",
                 issue.pdfUrl ? "colors-decoration-issue" : null)}>
            {options.locale === 'pl' ? 'Tom ' : 'Volume '}
            <span className="font-semibold">
              <WithUrlWrapper>{labelLocalized}</WithUrlWrapper>
            </span>
          </span>
          <div className="colors-issue-metadata text-base/5 mt-4">
            {articlesCount}{' '}{getArticlesCountSuffixInLanguage(articlesCount)}
            { issue.edited_by ?
              <>
                {" • "}
                {options.locale === 'pl' ? 'Redakcja: ' : 'Edited by: '}{' '}
                <span className="font-bold">{editedBy}</span>
              </>
              : null }
          </div>
      </div>
    )
}

function IssueDescription({ issue, options, getLocalized }: any) {
  const longDescription = getLocalized('long_description');

  if (!longDescription) return <div className="pt-4" />;

  return <div className="px-0 overflow-hidden">
    <Abstract sanitized_abstract={longDescription} isIssueAbstract={true} />
  </div>;
}
