'use client';

import * as React from 'react';
import clsx from 'clsx';

import { memo, MutableRefObject, useRef, useState, useEffect } from 'react';
import { Transition, Popover, Switch } from '@headlessui/react';
import AnimateHeight, { Height } from 'react-animate-height';

import Link from 'next/link';

import {
  Highlight,
  Snippet,
  useInfiniteHits,
  useConfigure,
} from 'react-instantsearch';

import { slugifyIssue } from '@/slugify';

const IconDownload = () => (
  <svg
    fill="none"
    viewBox="0 0 20 20"
    strokeWidth={2.1}
    stroke="currentColor"
    className="h-4 w-4">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.5 13.75v1.875A1.875 1.875 0 0 0 4.375 17.5h11.25A1.875 1.875 0 0 0 17.5 15.625V13.75M13.75 10L10 13.75m0 0L6.25 10m3.75 3.75V2.5"
    />
  </svg>
);

const IconExternal = () => (
  <span className="hidden xs:block">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 mt-[-2px] mb-1 ml-[-4px]">
      <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
    </svg>
  </span>
);

const IconIssue = () => (
  <span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v11.75A2.75 2.75 0 0 0 16.75 18h-12A2.75 2.75 0 0 1 2 15.25V3.5Zm3.75 7a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM5 5.75A.75.75 0 0 1 5.75 5h4.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 8.25v-2.5Z"
        clipRule="evenodd"
      />
      <path d="M16.5 6.5h-1v8.75a1.25 1.25 0 1 0 2.5 0V8a1.5 1.5 0 0 0-1.5-1.5Z" />
    </svg>
  </span>
);

import { Issue } from '@/types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

import useOptions from '@/helpers/hooks/use_options';
import './colors.css';

enum Lang {
  Pl = 'pl',
  En = 'en',
  Both = 'both',
}

export function InfiniteHits({
  locale,
  cache,
}: {
  locale: string;
  cache: any;
}) {
  const { hits, isLastPage, showMore } = useInfiniteHits({ cache });
  const sentinelRef = useRef(null);

  const { refine } = useConfigure({
    hitsPerPage: 10,
    attributesToSnippet: [
      'abstract_en:20',
      'abstract_pl:20',
      'title_en:20',
      'title_pl:20',
      'keywords_pl:10',
      'keywords_en:10',
    ],
  });

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [isLastPage, showMore, sentinelRef.current]);

  return (
    <div className="colors-searchhits w-full">
      <ul>
        {hits.map((hit, i) => (
          <SearchHitWidget hit={hit} locale={locale} key={i} />
        ))}
        {!isLastPage && (
          <li
            ref={sentinelRef}
            className="mb-2 flex h-10 items-center justify-center"
            aria-hidden="true">
            <div className="dot-pulse dot-pulse-colors
                            before:dot-pulse-colors after:dot-pulse-colors"></div>
          </li>
        )}
      </ul>
    </div>
  );
}

const reMark = /<mark>.+<\/mark>/;

const isMarked = (hit: any, field: string) => {
  const withMark = hit['_highlightResult'][field].value;
  return reMark.test(withMark);
};

const detectPreferredLang = (hit: any, fieldStr: string, locale: string) => {
  const plExists =
    typeof hit[fieldStr + '_pl'] === 'string' &&
    hit[fieldStr + '_pl'].length != 0;
  const enExists =
    typeof hit[fieldStr + '_en'] === 'string' &&
    hit[fieldStr + '_en'].length != 0;

  if (!plExists && !enExists) {
    return null;
  } else if (!plExists) {
    return 'en';
  } else if (!enExists) {
    return 'pl';
  }

  const plMarked = isMarked(hit, fieldStr + '_pl');
  const enMarked = isMarked(hit, fieldStr + '_en');

  if ((plMarked && enMarked) || (!plMarked && !enMarked)) {
    return locale;
  }
  if (plMarked) {
    return 'pl';
  }
  if (enMarked) {
    return 'en';
  }

  return locale;
};

const augmentFieldWithLang = (hit: any, fieldStr: string, locale: string) => {
  const preferredLang = detectPreferredLang(hit, fieldStr, locale);
  return preferredLang ? fieldStr + '_' + preferredLang : null;
};

function SearchHitAuthors({ hit }: any) {
  const highlightResult = hit['_highlightResult'];

  return hit.authors ? (
    <div className="mb-1 mr-auto">
      {hit.authors.map((author: any, i: number) => {
        const pseudoHit = {
          ...hit.authors[i],
          _highlightResult: {
            ...highlightResult.authors[i],
          },
        };
        return (
          <React.Fragment key={i}>
            <Highlight attribute="fullname" hit={pseudoHit} />
            {i !== hit.authors.length - 1 ? ', ' : ''}
          </React.Fragment>
        );
      })}
    </div>
  ) : null;
};

const SearchHitIssue = ({ hit, locale }: any) => {
  const issueLabelWithLang = hit.issue
    ? ((locale === 'pl' ? hit.issue.label_pl : hit.issue.label_en) ??
      hit.issue.label_pl ??
      hit.issue.label_en)
    : null;

  return issueLabelWithLang ? (
    <Link
      href={`${slugifyIssue(hit.issue.label_en, hit.issue.label_pl)}?highlight=${hit.id}`}
      scroll={false}
    >
      <button
        className="colors-searchhit-download w-24 xs:w-auto
                   rounded-lg px-2 py-0 align-top ml-2 text-sm
                   font-medium transition-colors flex items-center gap-1">
        <IconIssue /> 
        <p className="truncate">
          {issueLabelWithLang}
        </p>
        <IconExternal />
      </button>
    </Link>
  ) : null;
};

const SearchHitPdf = ({ hit }: any) => {
  return (hit.pdf && hit.pdf.url) ? (
    <a href={STRAPI_URL + hit.pdf.url} target="_blank">
      <button
        className="colors-searchhit-download inline rounded-lg px-2 py-0 align-top
                   text-sm font-medium transition-colors ml-2">
        <span className="flex items-center gap-1">
          <IconDownload /> PDF
        </span>
      </button>
    </a>
  ) : null;
};

const SearchHitTitle = ({ hit, locale }: any) => {
  const titleWithLang = augmentFieldWithLang(hit, 'title', locale);

  return titleWithLang ? (
    <div className="mb-1 text-lg font-semibold leading-6">
      <Highlight attribute={titleWithLang} hit={hit} />
    </div>
  ) : null;
};

const SearchHitAbstract = ({ hit, locale }: any) => {
  const abstractWithLang = augmentFieldWithLang(hit, 'abstract', locale);

  return abstractWithLang ? (
    <span className="mb-1 text-base">
      <Highlight attribute={abstractWithLang} hit={hit} />
    </span>
  ) : null;
};

const SearchHitKeywords = ({ hit, locale }: any) => {
  const keywordsWithLang = augmentFieldWithLang(hit, 'keywords', locale);

  return (keywordsWithLang && isMarked(hit, keywordsWithLang)) ? (
    <span className="mb-1 text-sm italic [.dark_&]:text-default-200 text-sm">
      <Highlight attribute={keywordsWithLang} hit={hit} />
    </span>
  ) : null;
};

function SearchHitWidget({ hit, locale }: { hit: any; locale: string }) {
  const highlightResult = hit['_highlightResult'];

  return (
    <li className={clsx(
        'colors-search-hit relative',
        'before:absolute before:left-0 before:top-0 before:h-full before:w-full',
        'pb-2 pt-2',
      )}>
      <div className="relative m-2 mx-auto h-full w-full max-w-xl overflow-hidden rounded-lg px-4">
        <div className={clsx('flex flex-col gap-2')}>
          <div className="flex items-start">
            <SearchHitAuthors hit={hit} />
            <div className="flex">
              <SearchHitIssue hit={hit} locale={locale} />
              <SearchHitPdf hit={hit} />
            </div>
          </div>
          <SearchHitTitle hit={hit} locale={locale} />
          <SearchHitAbstract hit={hit} locale={locale} />
          <SearchHitKeywords hit={hit} locale={locale} />
        </div>
      </div>
    </li>
  );
}
