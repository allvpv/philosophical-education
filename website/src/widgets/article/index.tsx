'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { memo } from 'react';

import { MutableRefObject, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Transition, Popover, Switch } from '@headlessui/react';
import { useSearchParams } from 'next/navigation';

import { Issue, Article, ArticleAuthor } from '@/types';

import useOptions from '@/helpers/hooks/use_options';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const getStrapiUrl = (suffix: string) => `${STRAPI_URL}${suffix}`;

function ArticleWidgetHighlightHandler({ id, reference, children } : any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const _highlight = parseInt(searchParams.get("highlight") ?? "NaN");
  const highlight = isNaN(_highlight) ? undefined :  _highlight;

  useEffect(() => {
    if (highlight === id) {
      const timeout = setTimeout(() => {
        reference.current?.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'center'});
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, []); // Notice empty dependency array:
          // You don't want this to scroll each time pathname is changed
  
  return (
    <div className={clsx(
         "relative h-full w-full overflow-hidden rounded-3xl",
          id === highlight &&
              "ring-4 [.light_&]:ring-default-700 [.dark_&]:ring-default-100",
          id === highlight &&
              "[.bw_&]:ring-black [.wb_&]:ring-black",
          id === highlight &&
              "[.bw_&]:ring-4 [.wb_&]:ring-8",
       )}>
       {children}
     </div>
  );
}

export function ArticleWidget({
  locale,
  issue,
  article,
  translations,
}: {
  locale: string;
  issue: Issue;
  article: Article;
  translations: Record<string, string>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [localePrimary, localeSecondary] = (() => {
    if (article.monoLang !== '') return [article.monoLang, null];
    else return [locale, locale === 'pl' ? 'en' : 'pl'];
  })();

  const [options, setOption] = useOptions({
    showBibTeX: false,
    showORCID: false,
    showDOI: false,
    showCEJSH: false,
    locale: localePrimary,
  });

  function getLocalized(field: any) {
    const primary = `${field}_${options.locale}`;
    const fallback = `${field}_${options.locale === 'pl' ? 'en' : 'pl'}`;

    return (article as any)[primary] ?? (article as any)[fallback];
  }

  const hasORCID = article.authors.some((author: ArticleAuthor) => !!author.orcid);
  const hasDOI = !!article.doi;
  const hasCEJSH = article.authors.some((author: ArticleAuthor) => !!author.cejsh);
  const hasUrl = !!article.PDF?.url;

  return (
    <Popover
      className={clsx(
        "before:colors-article-widget group/article relative ",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-full ",
        "before:rounded-3xl rounded-3xl",
      )}
      id={article.id.toString()}
      ref={ref}
    >
      {({ open }) => (
        <ArticleWidgetHighlightHandler id={article.id} reference={ref}>
          <div
            className={clsx(
              'pt-4 transition-transform duration-[600ms] ease-allvpv ',
              !options.showBibTeX && 'ui-open:translate-x-[-8px]',
              options.showBibTeX && 'ui-open:translate-x-[-16px]',
              'flex flex-col',
            )}>
            <div className="block">
              <ArticleMainButtons
                article={article}
                options={options}
                setOption={setOption}
                localePrimary={localePrimary}
                localeSecondary={localeSecondary}
                hasUrl={hasUrl}
              />
              <ArticleAuthors article={article} options={options} />
              <ArticleTitle
                article={article}
                options={options}
                getLocalized={getLocalized}
                pages={article.pages}
                hasUrl={hasUrl}
              />
              <ArticleKeywords article={article} getLocalized={getLocalized} />
            </div>
            <ArticleAbstract article={article} getLocalized={getLocalized} />
          </div>
          <Popover.Panel
            static
            className={clsx(
              'absolute bottom-0 top-0 rounded-r-3xl',
              'transition-[left] ease-allvpv',
              'flex w-full',
              'colors-overlay',
              !options.showBibTeX && 'colors-options-overlay duration-[300ms]',
              options.showBibTeX && 'colors-bibtex-overlay',
              !open && 'left-[100%]',
              open &&
                !options.showBibTeX &&
                'left-[calc(100%-120px)] min-h-[150px]',
              open && options.showBibTeX && 'left-0 duration-[400ms]',
              !open && options.showBibTeX && 'duration-[500ms]',
            )}>
            {open && !options.showBibTeX && (
              <ArticleRegularOptions
                hasORCID={hasORCID}
                hasDOI={hasDOI}
                hasCEJSH={hasCEJSH}
                options={options}
                setOption={setOption}
                translations={translations}
              />
            )}
            {open && options.showBibTeX && (
              <ArticleBibTeX
                options={options}
                issue={issue}
                article={article}
                translations={translations}
                bibtex={getLocalized('bibtex')}
              />
            )}
          </Popover.Panel>
        </ArticleWidgetHighlightHandler>
      )}
    </Popover>
  );
}

const ArticleAuthorTag = ({
  classForTag,
  subPath,
  icon,
  href,
}: {
  classForTag: string;
  subPath: string;
  icon?: any;
  href: string;
}) => (
  <span className="article-author-tags">
    <span> </span>
    <a href={`${href}/${subPath}`}
       target="_blank"
       rel="noopener noreferrer"
       className={classForTag}>
      <span className="mr-1 text-xs">{subPath}</span>
      {icon}
    </a>
  </span>
);

function ArticleAuthors({
  article,
  options,
}: {
  article: Article;
  options: {
    showORCID: boolean;
    showCEJSH: boolean;
  };
}) {
  const router = useRouter();

  return (
    <div className="order-1 pl-7 pt-2">
      {article.authors.map((author: ArticleAuthor, i: number) => (
        <span key={i}>
          {i != 0 ? options.showORCID || options.showCEJSH ? <br /> : ', ' : ''}
          <a className={clsx(
              'colors-author colors-author-decoration relative text-base underline decoration-[3px]',
              'cursor-pointer',
              options.showORCID && 'mr-1',
            )}
            onClick={(e) => {
            // Make sure this constant (640) is synchronized with Tailwind „sm”
            // parameter TODO: Synchronize with Tailwind „sm” automatically.
              if (document.body.clientWidth > 640) { // „Desktop” mode
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0;
              }

              router.push(getLinkForRouterForward(author.fullName, 'author'), { scroll: false });
              e.preventDefault();
            }}>
            {author.fullName}
          </a>
          {options.showORCID && (
            <ArticleAuthorTag
              classForTag="whitespace-nowrap underline decoration-[2px] colors-orcid-decoration
                           colors-author"
              subPath={author.orcid}
              icon={<IconORCID />}
              href="https://orcid.org"
            />
          )}
          {options.showCEJSH && (
            <ArticleAuthorTag
              classForTag="break-all underline decoration-[2px] colors-cejsh-decoration
                           colors-author"
              subPath={author.cejsh}
              href="http://cejsh.icm.edu.pl/cejsh/contributor"
            />
          )}
        </span>
      ))}
    </div>
  );
}

function ArticleTitle({
  article,
  options,
  getLocalized,
  pages,
  hasUrl,
}: {
  article: Article;
  options: {
    showDOI: boolean;
  };
  getLocalized: any;
  pages: string;
  hasUrl: boolean;
}) {
  const title = getLocalized('title');
  const isPositiveWholeNumber = (value: string) => /^\d+$/.test(value);

  return (
    <div className="order-2 mb-6 mt-4 px-7 text-lg font-semibold leading-tight">
      <div className="title-shade mb-1 mr-2">
        {hasUrl ? (
          <a
            className="colors-title underline decoration-[3px]"
            href={getStrapiUrl(article.PDF?.url ?? '')}
            target="_blank">
            {title}
          </a>
        ) : (
          <a className="colors-title">{title}</a>
        )}
        {pages ? (
          <span className="colors-title whitespace-pre-wrap text-base font-medium">
            {' '}
            {!isPositiveWholeNumber(pages) ? `(pp. ${pages})` : `(p. ${pages})`}
          </span>
        ) : (
          <React.Fragment />
        )}
      </div>
      {options.showDOI && (
        <span
          className="colors-title inline whitespace-nowrap
                         text-xs font-normal underline decoration-[2px]">
          <a
            className="break-all"
            href={`https://doi.org/${article.doi}`}
            target="_blank"
            rel="noopener noreferrer">
            <span className="mr-1">{`${article.doi}`}</span>
            <IconDOI />
          </a>
        </span>
      )}
    </div>
  );
}

function getLinkForRouterForward(query: string, field: string) {
  const options = field === 'keyword' ? 8 : 1;  // :)) TODO

  return `?${(new URLSearchParams({
    query: query,
    options: options.toString(),
  })).toString()}`;
}

function ArticleKeywords({
  article,
  getLocalized,
}: {
  article: Article;
  getLocalized: any;
}) {
  const router = useRouter();
  const localizedKeywords = getLocalized('keywords');

  if (!localizedKeywords) {
    return <React.Fragment />;
  }

  return (
    <div
      className="justify-intercharacter order-4 overflow-hidden break-all
                 text-justify text-sm leading-relaxed">
      {localizedKeywords.map((k: any, i: number) => (
        <span key={i} className="first-of-type:odd:ml-7">
          <a className="colors-keyword -mx-px cursor-pointer overflow-hidden rounded-lg
                        border px-[6px] py-0 transition-colors"
              onClick={(e) => {
                // Make sure this constant (640) is synchronized with Tailwind „sm”
                // parameter TODO: Synchronize with Tailwind „sm” automatically.
                if (document.body.clientWidth > 640) {
                  document.documentElement.scrollTop = 0
                  document.body.scrollTop = 0;
                }

                router.push(getLinkForRouterForward(k.keyword, 'keyword'), {
                    scroll: false
                });

                e.preventDefault();
              }}>
            {k.keyword}
          </a>
          <a> </a>
        </span>
      ))}
    </div>
  );
}

function ArticleMainButtons({
  article,
  options,
  setOption,
  localePrimary,
  localeSecondary,
  hasUrl,
}: any) {
  const hasSomethingVisible = options.showORCID || options.showDOI;

  return (
    <figure className="float-right mb-2 ml-3 mt-1 pr-5 text-sm">
      <div className="flex flex-col justify-center gap-2" >
        {
          <ButtonLanguage
            options={options}
            setOption={setOption}
            localePrimary={localePrimary}
            localeSecondary={localeSecondary}
          />
        }
        <ButtonPreference
          options={options}
          onClick={() => setOption('showBibTeX', false)}
        />
        <ButtonDownload url={article.PDF?.url} hasUrl={hasUrl} />
      </div>
    </figure>
  );
}

function ArticleAbstract({ article, getLocalized }: any) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showChevron, setShowChevron] = useState(true);
  const [showLot, setShowLot] = useState(true);

  const expandButtonRef = useRef<HTMLElement>(null);

  const sanitized_abstract = getLocalized('sanitized_abstract');

  useEffect(() => {
      if (expandButtonRef.current) {
        const ref = expandButtonRef.current;

      if (ref.scrollHeight <= ref.clientHeight * 1.5) {
        setShowChevron(false);
      }
    }
  }, []);

  return sanitized_abstract ? (
    <abstract
      className={clsx(
        'relative order-4 mt-5 block',
        showChevron && 'cursor-pointer',
        'colors-abstract rounded-b-3xl rounded-t-lg text-[0.98rem] leading-6',
        !clicked && 'unclicked',
        clicked && 'clicked',
        'group/abstract',
      )}
      onClick={() => setClicked(!clicked)}>
      {showChevron && (
        <expandbutton
          className="colors-abstract-expandbutton absolute right-0 top-0 ml-2 mr-0
                     flex h-[28px] w-[40px]
                     items-center justify-center rounded-md px-1.5
                     group-[.unclicked]/abstract:[&_circle]:opacity-0
                     group-[.clicked]/abstract:hoverable:[&_svg]:rotate-180">
          <ChevronDown />
        </expandbutton>
      )}
      <div
        className="hoverable:scrollbar-maclike
                   hoverable:scrollbar-abstract-colors
                   group-[.clicked]/abstract:overflow-y-scroll
                   group-[.clicked]/abstract:overscroll-contain
                   hoverable:[&::-webkit-scrollbar-track]:mb-[18px]
                   hoverable:[&::-webkit-scrollbar-track]:mt-[28px]">
        <expandbuttonplaceholder className="float-right ml-2 mr-0 h-[28px] w-[40px]" />
        <textcontainer
          /* `not-supports-lh` == @supports not (height: 1lh) */
          className={clsx(
            'hoverable:scrollbar-maclike hoverable:scrollbar-sidebar-colors ml-7 mr-5',
            'block font-serif text-base transition-[max-height] duration-300 ease-allvpv',
            showChevron && showLot && 'group-[.clicked]/abstract:max-h-[calc(10lh+16px)]',
            showChevron && showLot && 'group-[.clicked]/abstract:not-supports-lh:max-h-[256px]',
            showChevron && 'group-[.unclicked]/abstract:max-h-[calc(2lh+16px)]',
            showChevron && 'group-[.clicked]/abstract:pr-6',
            showChevron && 'group-[.unclicked]/abstract:not-supports-lh:max-h-[64px]',
            showChevron && 'group-[.unclicked:hover]/abstract:hoverable:max-h-[calc(3lh+16px)]',
            showChevron && 'group-[.unclicked:hover]/abstract:hoverable:not-supports-lh:max-h-[89px]',
          )}
          ref={expandButtonRef}>
          <textpadding className="block h-[8px]" />
          <textofabstract
            dangerouslySetInnerHTML={{ __html: sanitized_abstract }}
          />
          <textpadding className="block h-[8px]" />
        </textcontainer>
      </div>
    </abstract>
  ) : (
    <div className="mb-2" />
  );
}

//
// Options
//
const ArticleRegularOptions = ({
  hasORCID,
  hasDOI,
  hasCEJSH,
  options,
  setOption,
  translations,
}: any) => {
  return (
    <span
      className="flex h-full w-[120px] flex-col items-center justify-start gap-2
                 py-5 font-semibold">
      {hasORCID && (
        <ButtonSwitch
          childrenKnobOff={<IconEyeSlash />}
          childrenKnobOn={<IconEyeOpen />}
          childrenDescription={<span className="tracking-tighter">ORCID</span>}
          isActive={options.showORCID}
          setActive={(bool: boolean) => setOption('showORCID', bool)}
        />
      )}
      {hasDOI && (
        <ButtonSwitch
          childrenKnobOff={<IconEyeSlash />}
          childrenKnobOn={<IconEyeOpen />}
          childrenDescription={
            <span className="mt-[1px] flex items-center">DOI</span>
          }
          isActive={options.showDOI}
          setActive={(bool: boolean) => setOption('showDOI', bool)}
        />
      )}
      {hasCEJSH && (
        <ButtonSwitch
          childrenKnobOff={<IconEyeSlash />}
          childrenKnobOn={<IconEyeOpen />}
          childrenDescription={<span className="tracking-tighter">CEJSH</span>}
          isActive={options.showCEJSH}
          setActive={(bool: boolean) => setOption('showCEJSH', bool)}
        />
      )}
      <div className="grow" />
      <span
        className="colors-options-button-bibtex relative
                   flex h-[28px] w-[96px] cursor-pointer items-center
                   justify-end gap-2 rounded-lg px-2 text-sm font-medium
                   transition-colors"
        onClick={(bool) => setOption('showBibTeX', bool)}>
        BibTeX
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-4 w-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
          />
        </svg>
      </span>
      <Popover.Button
        className="colors-options-button-back relative flex h-[28px] w-[96px]
                   cursor-pointer items-center justify-start gap-2
                   rounded-lg px-2 text-sm font-normal transition-colors">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-4 w-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
          />
        </svg>
        {translations.backText}
      </Popover.Button>
    </span>
  );
};

function CopyBibTeXButton({ onClick, translations }: any) {
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (showCopied) {
      let timeout = setTimeout(() => {
        setShowCopied(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [showCopied]);

  return (
    <span className="relative">
      <button
        className={clsx(
          'colors-bibtex-toolbar-button h-[28px] transition-[width,border-color]',
          'cursor-pointer border-2',
          'rounded-lg',
          'text-sm font-normal duration-[300ms]',
          'bibtex-toolbar-copy-button group/button px-1',
          showCopied && 'w-full border-lime-300/[0.4] ease-allvpv',
          !showCopied &&
            'w-[35px] border-lime-300/[0.0] delay-[200ms] ease-allvpv',
        )}
        onClick={() => {
          onClick();
          setShowCopied(!showCopied);
        }}>
        <React.Fragment>
          <span
            className={clsx(
              'flex items-center justify-center',
              'absolute left-0 top-0 h-full w-[35px] transition-opacity',
              showCopied && 'invisible opacity-0',
              !showCopied &&
                'visible opacity-100 delay-[320ms] duration-[360ms]',
            )}>
            <IconDuplicate3 />
          </span>
          <span
            className={clsx(
              'flex items-center justify-center gap-1',
              'absolute left-0 top-0 h-full',
              !showCopied &&
                'invisible ' +
                  'opacity-0 transition-pass-[visibility_0s_step-end_500ms,opacity_150ms_350ms] ' +
                  '[&_path]:animate-[tick-back_500ms_reverse_forwards]',
              showCopied &&
                'visible opacity-100 [&_path]:animate-[tick_500ms_forwards]',
            )}>
            <IconCopied />
          </span>
          <span
            className={clsx(
              'shrink-1 mx-1.5 flex items-center justify-center overflow-hidden pl-6',
              !showCopied &&
                'invisible ' +
                  'transition-pass-[visibility_0s_step-end_300ms,opacity_100ms_ease-in_50ms] ' +
                  'opacity-0',
              showCopied &&
                'visible ' +
                  'transition-pass-[opacity_120ms_ease-in] ' +
                  'opacity-100',
            )}>
            {translations.copiedText}
          </span>
        </React.Fragment>
      </button>
    </span>
  );
}

function ArticleBibTeX({ issue, article, translations, bibtex }: any) {
  const BibTeX = bibtex;
  const BibLines = BibTeX.split('\n');

  return (
    <bibtexlisting
      className="colors-bibtex-listing
      grid h-[calc(100%-48px)] w-full
      grid-cols-[min-content_1fr] overflow-x-hidden overflow-y-scroll
      overscroll-none whitespace-nowrap text-xs font-normal">
      <bibtexlines className="colors-bibtex-lines relative h-full px-4 py-2 font-mono">
        {BibLines.map((_: any, i: number) => (
          <div key={i} className="text-right">
            {String(i)}
          </div>
        ))}
      </bibtexlines>
      <bibtexcontent
        className="colors-bibtex-content relative -ml-px overflow-x-scroll border-l px-2
                   py-2 font-mono">
        {BibLines.map((line: any, i: number) => (
          <div key={i}>{line}</div>
        ))}
      </bibtexcontent>
      <bibtextoolbar
        className="colors-bibtex-toolbar absolute bottom-0 left-0
                   right-0 flex h-[48px] w-full items-center
                   px-3">
        <Popover.Button
          className="colors-bibtex-toolbar-button relative ml-1 mr-2 inline-flex h-[28px]
                     w-max cursor-pointer items-center justify-start gap-2 rounded-lg px-2
                     text-sm font-normal transition-[filter]">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
          {translations.backText}
        </Popover.Button>
        <CopyBibTeXButton
          onClick={() => {
            const clipboard = navigator.clipboard;

            if (clipboard !== undefined) clipboard.writeText(BibTeX);
          }}
          translations={translations}
        />
      </bibtextoolbar>
    </bibtexlisting>
  );
}

//
// Buttons
//

const ButtonOrder = ({ ordinal_number }: any) => {
  return (
    <div
      className="group/button colors-button-light flex h-[28px] w-[72px] items-center
                 justify-center whitespace-pre-wrap rounded-lg text-baseplus
                 font-medium transition-colors duration-[300ms]">
      <span className="text-default-900">1</span>
      <span className="text-default-700"> of 14</span>
    </div>
  );
};

const ButtonLanguage = ({
  options,
  setOption,
  localePrimary,
  localeSecondary,
}: any) => {
  const isChecked = options.locale === localeSecondary;

  return (
    <Switch
      checked={isChecked}
      onChange={(checked) =>
        setOption('locale', checked ? localeSecondary : localePrimary)
      }
      className={clsx(
        'group/button relative h-[28px] w-[72px]',
        'rounded-lg font-medium transition-colors duration-[300ms]',
        'colors-button-light z-0',
        !localeSecondary && 'pointer-events-none opacity-50',
      )}>
      <span
        className={clsx(
          'absolute left-0 top-0 z-20 h-[28px] w-[38px]',
          'inline-flex items-center justify-center',
          'rounded-lg transition-[transform] duration-[300ms] ease-allvpv will-change-transform',
          'colors-button-medium split-specific',
          !isChecked && 'translate-x-0',
          isChecked && 'translate-x-[34px]',
          !isChecked &&
            'group-hover/button:translate-x-[4px] group-hover/button:translate-x-[4px]',
          isChecked && 'group-hover/button:translate-x-[30px]',
        )}>
        {localePrimary.toUpperCase()}
      </span>
      <span
        className={clsx(
          'absolute left-[38px] top-0 z-10 h-[28px] w-[30px] px-[5px]',
          'inline-flex items-center justify-center',
          'transition-[transform] duration-[300ms] ease-allvpv will-change-transform',
          !isChecked && 'translate-x-0',
          isChecked && 'translate-x-[-34px]',
        )}>
        {localeSecondary
          ? localeSecondary.toUpperCase()
          : localePrimary.toUpperCase() === 'PL'
            ? 'EN'
            : 'PL'}
      </span>
    </Switch>
  );
};

const ButtonSplit = ({ childrenLeft, childrenRight, onClick }: any) => (
  <Popover.Button
    className={clsx(
      'group/button h-[28px] w-[72px]',
      'colors-button-light hover:colors-button-medium rounded-lg',
      'flex items-stretch justify-stretch font-medium transition-colors',
      'cursor-pointer',
    )}
    onClick={onClick}>
    <div
      className="
      colors-button-medium group-hover/button:colors-button-hard split-specific
      flex grow-[1.3] items-center justify-center rounded-lg
      transition-colors">
      {childrenLeft}
    </div>
    <div className="flex grow items-center justify-center pr-px">
      {childrenRight}
    </div>
  </Popover.Button>
);

const ButtonPreference = ({ options, onClick }: any) => {
  const somethingVisible = options.showDOI && options.showORCID;

  return (
    <ButtonSplit
      childrenLeft={!somethingVisible ? <IconEyeSlash /> : <IconEyeOpen />}
      childrenRight={<IconPreferences />}
      onClick={onClick}
    />
  );
};

export const ButtonDownload = ({ url, hasUrl }: any) => {
  const buttonElement = (
    <button
      className={clsx(
        'transition-color colors-button-medium hover:colors-button-hard',
        'flex h-[28px] w-[72px]',
        'items-center justify-evenly rounded-lg',
        'px-1.5 text-sm',
        'font-medium duration-150',
        !hasUrl && 'pointer-events-none opacity-50',
      )}>
      <IconDownload />
      <span className="mr-1">PDF</span>
    </button>
  );

  return hasUrl ? (
    <a href={getStrapiUrl(url)} target="_blank">
      {buttonElement}
    </a>
  ) : (
    <span>{buttonElement}</span>
  );
};

export const ButtonSwitch = ({
  childrenKnobOff,
  childrenKnobOn,
  childrenDescription,
  isActive,
  setActive,
}: any) => (
  <Switch
    checked={isActive}
    onChange={setActive}
    className={clsx(
      'group/button relative',
      'h-[32px] w-[100px] rounded-lg font-medium transition-colors duration-[300ms]',
      isActive && 'colors-options-button-switch-active',
      !isActive && 'colors-options-button-switch-inactive',
    )}>
    <span
      className={clsx(
        'absolute left-0 top-0 z-20 inline-flex h-[32px] w-[36px] items-center justify-center',
        'rounded-lg transition-[transform,background-color] duration-[300ms]',
        'cursor-pointer ease-allvpv',
        isActive && 'translate-x-[64px] group-hover/button:translate-x-[60px]',
        !isActive && 'translate-x-0 group-hover/button:translate-x-[4px]',
        isActive && 'colors-options-button-switch-knob-active',
        !isActive && 'colors-options-button-switch-knob-inactive',
      )}>
      <span
        className={clsx(
          'absolute',
          isActive && 'opacity-0',
          !isActive && 'opacity-100',
        )}>
        {childrenKnobOff}
      </span>
      <span
        className={clsx(
          'absolute',
          isActive && 'opacity-100',
          !isActive && 'opacity-0',
        )}>
        {childrenKnobOn}
      </span>
    </span>
    <span
      className={clsx(
        'absolute left-[36px] top-0 z-10 inline-flex h-[32px] w-[64px] items-center justify-center',
        'px-[5px] transition-[transform,background-color] duration-[300ms] will-change-transform',
        'cursor-pointer ease-allvpv',
        isActive && 'translate-x-[-36px]',
        !isActive && 'translate-x-0',
      )}>
      {childrenDescription}
    </span>
  </Switch>
);

//
// Icons/SVG
//
export const IconDownload = () => (
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

const IconORCID = () => (
  <span>
    <svg
      className="mb-[2px] mr-0 inline"
      viewBox="0 0 256 256"
      strokeWidth={2.5}
      width="16"
      height="16">
      <path
        className="colors-icon-orcid-circle"
        d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"
      />
      <path
        className="colors-icon-orcid-text"
        d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z"
      />
      <path
        className="colors-icon-orcid-text"
        d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5
      c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"
      />
      <path
        className="colors-icon-orcid-text"
        d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1 C84.2,46.7,88.7,51.3,88.7,56.8z"
      />
    </svg>
  </span>
);

const IconDOI = () => (
  <span>
    <svg className="inline" width="16" height="16" viewBox="0 0 130 130">
      <circle style={{ fill: '#fcb425' }} cx="65" cy="65" r="64" />
      <path
        style={{ fill: '#000' }}
        d="m 49.819127,84.559148 -11.854304,0 0,-4.825665 c -1.203594,1.510894 -4.035515,3.051053 -5.264716,3.742483 -2.151101,1.203585 -5.072066,1.987225 -7.812161,1.987225 -4.430246,0 -8.373925,-1.399539 -11.831057,-4.446924 -4.1229464,-3.636389 -6.0602455,-9.19576 -6.0602455,-15.188113 0,-6.094791 2.1126913,-10.960381 6.3380645,-14.59676 3.354695,-2.893745 7.457089,-5.209795 11.810505,-5.209795 2.535231,0 5.661807,0.227363 7.889738,1.302913 1.280414,0.614601 3.572628,2.060721 4.929872,3.469179 l 0,-25.420177 11.854304,0 z m -12.1199,-18.692584 c 0,-2.253538 -0.618258,-4.951555 -2.205973,-6.513663 -1.587724,-1.587724 -4.474153,-2.996182 -6.727691,-2.996182 -2.509615,0 -4.834476,1.825511 -6.447807,3.720535 -1.306031,1.536501 -1.959041,3.905269 -1.959041,5.877114 0,1.971835 0.740815,4.165004 2.046836,5.701505 1.587714,1.895025 3.297985,3.193739 5.833216,3.193739 2.279145,0 4.989965,-0.956662 6.552083,-2.51877 1.587714,-1.562108 2.908377,-4.185134 2.908377,-6.464278 z"
      />
      <path
        style={{ fill: '#000' }}
        d="m 105.42764,25.617918 c -1.97184,0 -3.64919,0.69142 -5.03204,2.074271 -1.357247,1.357245 -2.035864,3.021779 -2.035864,4.993633 0,1.971835 0.678617,3.649193 2.035864,5.032034 1.38285,1.382861 3.0602,2.074281 5.03204,2.074281 1.99744,0 3.67479,-0.678627 5.03203,-2.035861 1.38285,-1.382861 2.07428,-3.073012 2.07428,-5.070454 0,-1.971854 -0.69143,-3.636388 -2.07428,-4.993633 -1.38285,-1.382851 -3.0602,-2.074271 -5.03203,-2.074271 z M 74.219383,45.507921 c -7.323992,0 -12.970625,2.283009 -16.939921,6.848949 -3.277876,3.782438 -4.916803,8.118252 -4.916803,13.008406 0,5.430481 1.626124,10.009834 4.878383,13.738236 3.943689,4.538918 9.475093,6.808622 16.59421,6.808622 7.093512,0 12.612122,-2.269704 16.555801,-6.808622 3.252259,-3.728402 4.878393,-8.1993 4.878393,-13.413648 0,-5.160323 -1.638938,-9.604602 -4.916803,-13.332994 -4.020509,-4.56594 -9.398263,-6.848949 -16.13326,-6.848949 z m 24.908603,1.386686 0,37.634676 12.599304,0 0,-37.634676 -12.599304,0 z M 73.835252,56.975981 c 2.304752,0 4.263793,0.852337 5.877124,2.554426 1.638928,1.675076 2.458402,3.727881 2.458402,6.159457 0,2.458578 -0.806671,4.538022 -2.419992,6.240111 -1.613331,1.675086 -3.585175,2.514099 -5.915534,2.514099 -2.612051,0 -4.737546,-1.027366 -6.376474,-3.080682 -1.331637,-1.648053 -1.997451,-3.539154 -1.997451,-5.673528 0,-2.107362 0.665814,-3.985138 1.997451,-5.633201 1.638928,-2.053316 3.764423,-3.080682 6.376474,-3.080682 z"
      />
    </svg>
  </span>
);

const IconEyeSlash = ({ scale = 1 }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-[19px] w-[19px]">
    <path
      fillRule="evenodd"
      d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
      clipRule="evenodd"
    />
    <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
  </svg>
);

const IconEyeOpen = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-[19px] w-[19px]">
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path
      fillRule="evenodd"
      d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

const IconClipboardCopy = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.0}
    stroke="currentColor"
    className="h-5 w-5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
    />
  </svg>
);

const IconCopied = () => (
  <svg
    fill="none"
    viewBox="0 0 35 30"
    strokeWidth={3.5}
    className="colors-icon-copied h-6 w-7 shrink-0 ease-[cubic-bezier(.42,.88,.74,.28)]">
    <path
      className="translate-x-[8px]"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="24.710262298583984 16.0149269104004"
      strokeDashoffset="-10.6066017150879"
      d="M 2 8.25 l 13.5 13.5 12 -18"
    />
  </svg>
);

const IconPreferences = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-[19px] w-[19px]">
    <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" />
  </svg>
);

const IconDuplicate3 = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
    <path
      fillRule="evenodd"
      d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

const IconDuplicate2 = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
    <path
      d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117
             6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379
             4.5H7v-1z"
    />
    <path
      d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0
             00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    fill="none"
    viewBox="0 0 20 20"
    strokeWidth="2"
    stroke="currentColor"
    className="h-6 w-6 transition-transform duration-[400ms]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 15 7.5 l -5 5 -5 -5"
    />
    <circle
      cx="10"
      cy="7.5"
      r="1.3"
      stroke="none"
      fill="currentColor"
      className="transition-opacity"
    />
  </svg>
);
