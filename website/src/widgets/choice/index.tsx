'use client';

import {
  useState,
  useMemo,
  useRef,
  useEffect,
  Fragment,
  memo,
  lazy,
} from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Listbox, Switch, Transition } from '@headlessui/react';

import { useDebounce } from 'use-debounce';
import clsx from 'clsx';

import { IssueStub } from '@/types';
import { YearPicker } from './year_picker';
import IssuesList from './issues_list';

const SearchBloat = lazy(() => import('@/widgets/searchbloat'));
const RangeButtonMemo = memo(RangeButton);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-4 w-4 stroke-[3]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

const ChevronLeft = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className={`${className}`}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
);

const ChevronUpDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="ml-1 mr-[-4px] mt-[1px] hidden h-4 w-4 rotate-180 xs:block">
    <path
      fillRule="evenodd"
      d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

function Adjustments({
  locale,
  currentLocale,
  setCurrentLocale,
  allFields,
  selectedFields,
  setSelectedFields,
  allSort,
  sortBy,
  setSortBy,
  translations,
}: {
  locale: string;
  currentLocale: string;
  setCurrentLocale: (arg0: string) => void;
  allFields: string[];
  selectedFields: number[];
  setSelectedFields: (arg0: number[]) => void;
  allSort: string[];
  sortBy: number | null;
  setSortBy: (arg0: number | null) => void;
  translations: Record<string, string>;
}) {
  const setSortByUnclickable = (selection: number) => {
    if (selection === sortBy) {
      setSortBy(null); // Unclick
    } else {
      setSortBy(selection);
    }
  };

  const setSelectedFieldsNoEmpty = (selection: number[]) => {
    if (selection.length > 0) {
      setSelectedFields(selection);
    }
  };

  return (
    <div className="relative mx-auto flex max-w-xl items-center gap-3 overflow-visible px-4">
      <ButtonLanguage
        localePrimary={locale}
        localeSecondary={locale === 'pl' ? 'en' : 'pl'}
        isSecondaryActive={locale !== currentLocale}
        switchLocales={() => {
          const newLocale = currentLocale === 'pl' ? 'en' : 'pl';
          setCurrentLocale(newLocale);
        }}
      />
      <Listbox
        as="div"
        className="relative block overflow-visible"
        value={selectedFields}
        onChange={setSelectedFieldsNoEmpty}
        multiple>
        <Listbox.Button
          className={clsx(
            selectedFields.length === allFields.length
              ? 'colors-search-include'
              : 'colors-search-include-selected',
            'group flex h-[28px]',
            'w-[120%] max-w-full cursor-pointer items-center justify-center',
            'gap-1 rounded-lg',
            'px-4 text-left',
            'font-medium focus:outline-none',
            'focus-visible:border-indigo-500 focus-visible:ring-2',
            'focus-visible:ring-white/75 focus-visible:ring-offset-2',
            'focus-visible:ring-offset-orange-300 sm:text-sm',
          )}>
          <ChevronLeft
            className="h-3 w-3 transition-all duration-200 ease-in-out group-hover:mr-1 ui-open:mr-1
              ui-open:rotate-180"
            aria-hidden="true"
          />
          <span className="hidden sm:block">
            {selectedFields.map(
              (i, idx) =>
                `${allFields[i]}${idx + 1 === selectedFields.length ? '' : ', '}`,
            )}
          </span>
          <span className="block sm:hidden">{translations['include']}</span>
          <ChevronLeft
            className="h-3 w-3 rotate-180 transition-all duration-500 ease-allvpv group-hover:ml-1
              ui-open:ml-1 ui-open:rotate-0"
            aria-hidden="true"
          />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-allvpv duration-100"
          leaveFrom="opacity-100 mono:opacity-100"
          leaveTo="opacity-0">
          <Listbox.Options
            className="min-w-50 absolute mt-1 overflow-auto rounded-xl py-2 text-base
              focus:outline-none mono:border-4 mono:border-black mono:bg-white sm:text-sm
              [.dark_&]:bg-default-700 [.light_&]:bg-default-150">
            {allFields.map((field, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-12 pr-7 transition-colors
                  duration-100 [.dark_&]:text-default-50 ${
                  active
                      ? 'mono:underline [.dark_&]:bg-yellow-600/[0.2] [.light_&]:bg-amber-100/[0.7]'
                      : '[.light_&]:text-amber-900 [.light_&]:text-default-900'
                  }`
                }
                value={i}>
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? 'font-medium mono:font-semibold' : 'font-normal'}`}>
                      {field}
                    </span>
                    {selected ? (
                      <span
                        className="absolute inset-y-0 left-2 flex items-center pl-3 mono:underline
                          [.dark_&]:text-amber-400 [.light_&]:text-amber-600">
                        <CheckIcon aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
      <Listbox
        value={sortBy}
        onChange={setSortByUnclickable}
        as="div"
        className="relative block overflow-visible">
        <Listbox.Button
          className="data-[dosort=no]:colors-search-include
            data-[dosort=yes]:colors-search-include-selected group flex h-[28px] max-w-full
            cursor-pointer items-center justify-center gap-1 rounded-lg px-4 text-left
            font-medium transition-[background-color] focus:outline-none
            focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75
            focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          data-dosort={sortBy !== null ? 'yes' : 'no'}>
          <span className="flex items-center transition-all group-hover:mx-1 ui-open:mx-1">
            {translations['sort']} <ChevronUpDown />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-allvpv duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Listbox.Options
            className="min-w-50 absolute right-0 mt-1 overflow-auto rounded-xl py-2 text-base
              focus:outline-none mono:border-4 mono:border-black mono:bg-white sm:text-sm
              xs:right-auto [.dark_&]:bg-default-700 [.light_&]:bg-default-150">
            {allSort.map((field, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-6 pr-6 transition-colors
                  duration-100 [.dark_&]:text-default-50 ${
                  active
                      ? `mono:underline [.dark_&]:bg-yellow-600/[0.2] [.light_&]:bg-amber-100/[0.7]
                        [.light_&]:text-amber-900`
                      : '[.light_&]:text-default-900'
                  }`
                }
                value={i}>
                {({ selected }) => (
                  <span
                    className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                    {field}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

const ButtonLanguage = ({
  localePrimary,
  localeSecondary,
  isSecondaryActive,
  switchLocales,
}: any) => {
  const isChecked = isSecondaryActive;

  return (
    <Switch
      checked={isChecked}
      onChange={(checked) =>
        switchLocales(checked ? localeSecondary : localePrimary)
      }
      className={clsx(
        'group/button relative h-[28px] w-[72px]',
        'rounded-lg font-normal transition-colors duration-[300ms]',
        'colors-button-light z-0 text-base',
        !localeSecondary && 'pointer-events-none opacity-50',
      )}>
      <span
        className={clsx(
          'absolute left-0 top-0 z-20 h-[28px] w-[38px]',
          'inline-flex items-center justify-center',
          `rounded-lg transition-[transform] duration-[300ms] ease-allvpv
          will-change-transform`,
          'colors-button-medium split-specific',
          !isChecked && 'translate-x-0',
          isChecked && 'translate-x-[34px]',
          !isChecked && 'group-hover/button:translate-x-[4px]',
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

function computeMinAndMaxYear(list: IssueStub[]) {
  const minBound = 2200;
  const maxBound = 1899;

  let [minYear, maxYear] = list.reduce(
    (acc: [number, number], issue: IssueStub): [number, number] => {
      const [minYear, maxYear] = acc;

      return [
        issue.year < minYear ? issue.year : minYear,
        issue.year > maxYear ? issue.year : maxYear,
      ];
    },
    [minBound, maxBound],
  );

  // Just in case...
  minYear = Math.max(minYear, maxBound);
  maxYear = Math.min(maxYear, minBound);

  return [minYear, maxYear];
}

export function SearchBox(params: {
  inputRef: any;
  placeholder: string;
  value: string;
  onFocus: any;
  handleSearch: any;
  reset: any;
}) {
  const onInputChange = (e: any) => {
    params.handleSearch(e.target.value);
  };

  const onButtonClick = () => {
    if (params.inputRef.current) {
      params.inputRef.current.value = '';
    }

    params.reset();
  };

  return (
    <>
      <SearchIcon />
      <input
        placeholder={params.placeholder}
        className="input-safari-fix h-full w-full appearance-none bg-transparent py-1.5 pr-3
          text-base outline-none placeholder:text-current"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        ref={params.inputRef}
        defaultValue={params.value}
        onChange={onInputChange}
        onFocus={params.onFocus}
      />
      <button className="clear-icon colors-clear-icon" onClick={onButtonClick}>
        <IconBackspace />
      </button>
    </>
  );
}

const SearchBoxMemo = memo(SearchBox);

function RangeButton(params: any) {
  return (
    <span
      className="order-2 flex h-10 w-12 shrink-0 items-center overflow-hidden transition-width
        data-[empty=no]:w-0 sm:w-auto"
      data-empty={params.isQueryEmpty ? 'yes' : 'no'}>
      <button
        className={clsx(
          'flex h-9 w-full pl-1 pr-1 sm:pl-2 sm:pr-4',
          'items-center justify-center border-r',
          'font-regular text-base leading-6',
          'rounded-lg border-transparent',
          params.someFilteringApplied || params.showSelected
            ? 'colors-issue-button-active'
            : 'colors-issue-button',
        )}
        onClick={params.onClick}>
        <span
          className="inline data-[empty=no]:hidden sm:data-[empty=no]:inline"
          data-empty={params.isQueryEmpty ? 'yes' : 'no'}>
          {!params.someFilteringApplied ? <IconFilter /> : <IconClear />}
        </span>
        <span className="hidden sm:inline">
          {!params.someFilteringApplied
            ? params.translations['range']
            : params.translations['reset']}
        </span>
      </button>
    </span>
  );
}

function packSelectedFields(
  selectedFields: any,
  options: number | null,
  allFields: any,
) {
  const shift = allFields.length;

  // Doesn't matter; sortBy is default here.
  if (options === null) {
    options = 0;
  }

  if (!(options >> shift) && selectedFields.length == allFields.length) {
    return null;
  } else {
    const selectedFieldsSorted = selectedFields.sort();
    const hash = selectedFieldsSorted
      .map((n: number) => 2 ** n)
      .reduce((s: number, n: number) => s + n);
    options &= 0xffffffff << shift;
    options |= hash;
    return options;
  }
}

function packSortBy(
  sortBy: number | null,
  options: number | null,
  allFields: any,
) {
  const shift = allFields.length;

  if (options === null) {
    options = (1 << shift) - 1; // Default options
  }

  sortBy = sortBy === null ? 0 : sortBy + 1;
  const selectedFieldsMask = (1 << shift) - 1;

  if (!sortBy && (options & selectedFieldsMask) == 15) {
    return null;
  } else {
    options &= ~(0xffffffff << shift);
    options |= sortBy << shift;
    return options;
  }
}

function unpackOptions(options: number | null, allFields: any, allSortBy: any) {
  const shift = allFields.length;

  if (options === null) {
    options = (1 << shift) - 1; // Default options
  }

  //
  // Parse selected
  //
  let selected = options & ~(0xffffffff << shift);
  let selectedFields = [];

  for (let i = 0; selected; ++i) {
    if (selected & 1) {
      selectedFields.push(i);
    }

    selected >>= 1;
  }

  //
  // Parse and normalize sortBy
  //
  let sortByRaw = options >> shift;

  const sortByNormalize: number | null = (() => {
    if (sortByRaw === 0) {
      return null;
    } else if (sortByRaw > allSortBy.length) {
      return allSortBy.length - 1;
    } else {
      return sortByRaw - 1;
    }
  })();

  return {
    selectedFields,
    sortBy: sortByNormalize,
  };
}

const getURLQuery = (searchParams: any) => {
  const query = searchParams.get('query');
  return query || '';
};

const getURLOptions = (searchParams: any) => {
  const options = parseInt(searchParams.get('options'));
  return isNaN(options) ? null : options;
};

const getURLLocale = (searchParams: any, globalLocale: string) => {
  const localeUrl = searchParams.get('searchLocale');

  return localeUrl === 'pl' ? 'pl' : localeUrl === 'en' ? 'en' : globalLocale;
};

const setURLParam = (params: any, key: string, value: string | undefined) => {
  if (value && value.length > 0) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
};

// Set current state to searchParams *and* set searchParrams to current state
// (tricky, I know...)
function SearchParamsHandler(params: any) {
  // We need debounce, because updating URL is costly and causes throttling.
  const [[queryDebounced, optionsDebounced, currentLocaleDebounced]] =
    useDebounce([params.query, params.options, params.currentLocale], 400);
  const router = useRouter();
  const searchParamsConst = useSearchParams();
  const pathname = usePathname();

  let searchParams = new URLSearchParams(searchParamsConst.toString());

  const updateStateFromSearchParams = () => {
    const newQuery = getURLQuery(searchParams);
    const newOptions = getURLOptions(searchParams);
    const newSearchLocale = getURLLocale(searchParams, params.locale);

    if (newQuery) {
      params.allowLoadingSearchBloat.current = true;
    }

    if (params.inputRef.current) {
      params.inputRef.current.value = newQuery;
    }

    newQuery !== params.query && params.setQuery(newQuery);
    newOptions !== params.options && params.setOptions(newOptions);
    newSearchLocale !== params.currentLocale &&
      params.setCurrentLocale(newSearchLocale);
  };

  const updateSearchParamsFromState = () => {
    const oldUrl = window.location.search;

    setURLParam(searchParams, 'query', params.query);
    setURLParam(searchParams, 'options', params.options?.toString());
    setURLParam(
      searchParams,
      'searchLocale',
      params.currentLocale === params.locale ? undefined : params.currentLocale,
    );

    // Prevent scrolling on page refresh
    if (params.query) {
      searchParams.delete('highlight');
    }

    const paramsStrFull = `?${searchParams.toString()}`;
    const newUrl =
      paramsStrFull.length === 1 // sole question mark
        ? ''
        : `${paramsStrFull}${window.location.hash}`;

    if (oldUrl !== newUrl) {
      if (!newUrl) {
        // New URL is empty (no search params).
        // Important!! Otherwise router ignores;
        router.replace(`${window.location.pathname}${window.location.hash}`, {
          scroll: false,
        });
      } else {
        router.replace(newUrl, { scroll: false });
      }

      return true;
    }

    return false;
  };

  let searchParamsChanged = useRef(false);
  let pathChanged = useRef(false);
  let ignoreSearchParamsChange = useRef(false);
  let timeForDebounce = useRef(false);

  // Be *very* careful when modifying these effects
  //
  useEffect(() => {
    timeForDebounce.current = true;
  }, [queryDebounced, optionsDebounced, currentLocaleDebounced]);

  useEffect(() => {
    searchParamsChanged.current = true;
  }, [searchParamsConst]);

  useEffect(() => {
    pathChanged.current = true;
  }, [pathname]);

  useEffect(() => {
    if (pathChanged.current) {
      pathChanged.current = false;
      searchParamsChanged.current = false;
      ignoreSearchParamsChange.current = false;

      updateStateFromSearchParams();
    } else if (searchParamsChanged.current) {
      searchParamsChanged.current = false;

      if (!ignoreSearchParamsChange.current) {
        updateStateFromSearchParams();
      } else {
        ignoreSearchParamsChange.current = false;
      }
    } else if (timeForDebounce.current) {
      timeForDebounce.current = false;
      const updated = updateSearchParamsFromState();

      if (updated) {
        ignoreSearchParamsChange.current = true;
      } else {
        // No change in params
        ignoreSearchParamsChange.current = false;
      }
    }
  });

  return <></>;
}

function SearchMagic({
  translations,
  list,
  locale,
  someFilteringApplied,
  showSelected,
  onRangeButtonClick,
}: any) {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => getURLQuery(searchParams));
  const [options, setOptions] = useState(() => getURLOptions(searchParams));
  const [currentLocale, setCurrentLocale] = useState(() =>
    getURLLocale(searchParams, locale),
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const isQueryEmpty = !query;
  const allowLoadingSearchBloat = useRef(!isQueryEmpty);

  const allFields = [
    translations['searchAuthors'],
    translations['searchTitle'],
    translations['searchAbstract'],
    translations['searchKeywords'],
    translations['searchRemaining'],
  ];

  const allSort = [
    translations['dateAscending'],
    translations['dateDescending'],
  ];

  const { sortBy, selectedFields } = unpackOptions(options, allFields, allSort);

  const setSelectedFields = (selectedFields: any) => {
    // Some fields have to be selected
    if (selectedFields.length) {
      const packed = packSelectedFields(selectedFields, options, allFields);
      setOptions(packed);
    }
  };

  const setSortBy = (sortBy: number | null) => {
    const packed = packSortBy(sortBy, options, allFields);
    setOptions(packed);
  };

  useEffect(() => {
    const width = document.body.clientWidth;

    if (!isQueryEmpty && width <= 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isQueryEmpty]);

  const handleSearch = (term: string) => {
    if (term && !allowLoadingSearchBloat.current) {
      allowLoadingSearchBloat.current = true;
    }

    setQuery(term);
  };

  const reset = (term: string) => {
    setQuery('');
    setOptions(null); // Default options
  };

  return (
    <Fragment>
      <SearchParamsHandler
        query={query}
        options={options}
        currentLocale={currentLocale}
        locale={locale}
        allowLoadingSearchBloat={allowLoadingSearchBloat}
        inputRef={inputRef}
        setOptions={setOptions}
        setQuery={setQuery}
        setCurrentLocale={setCurrentLocale}
      />
      <div
        className={clsx(
          `relative order-1 mx-auto ml-1 mt-[22px] flex w-full items-start gap-3
          sm:mt-[44px]`,
          'justify-stretch pb-2 pl-[4px] sm:px-5 xs:px-1.5',
        )}>
        <div
          className={clsx(
            'group/searchbox flex w-full flex-col items-stretch justify-start',
            isQueryEmpty && 'h-10',
            !isQueryEmpty &&
              'h-[calc(100dvh_-_156px)] min-h-[300px] sm:h-[calc(100dvh_-_192px)]',
            !isQueryEmpty &&
              'maxwsm:fixed maxwsm:bottom-0 maxwsm:top-0 maxwsm:h-full ' +
                'maxwsm:left-0 maxwsm:right-0 maxwsm:z-[999]',
          )}>
          <div className="flex h-10 min-h-10 items-center">
            <div
              className="colors-search-box font-regular relative z-40 flex h-9 w-full items-center
                justify-stretch pl-2 text-base leading-6 transition-[background-color,height]
                duration-300 focus-within:h-10 data-[empty=no]:h-10 data-[empty=yes]:rounded-xl
                data-[empty=no]:rounded-t-xl maxwsm:data-[empty=no]:rounded-none"
              data-empty={isQueryEmpty ? 'yes' : 'no'}>
              <SearchBoxMemo
                inputRef={inputRef}
                value={query}
                placeholder={translations['search']}
                handleSearch={handleSearch}
                reset={reset}
                onFocus={(e: any) => {
                  if (!allowLoadingSearchBloat.current) {
                    allowLoadingSearchBloat.current = true;
                  }

                  const value = e.target.value;

                  if (value) {
                    handleSearch(value);
                  }
                }}
              />
            </div>
          </div>
          <div
            className="colors-search-popup block h-full w-full overflow-scroll overscroll-contain
              rounded-b-2xl border-x border-b data-[empty=yes]:hidden
              maxwsm:data-[empty=no]:rounded-none maxwsm:data-[empty=no]:border-none"
            data-empty={isQueryEmpty ? 'yes' : 'no'}>
            <div className="colors-search-helper sticky top-0 z-50 w-full py-2 maxwsm:z-[1000]">
              <Adjustments
                locale={locale}
                currentLocale={currentLocale}
                setCurrentLocale={setCurrentLocale}
                allFields={allFields}
                selectedFields={selectedFields}
                setSelectedFields={setSelectedFields}
                allSort={allSort}
                sortBy={sortBy}
                setSortBy={setSortBy}
                translations={translations}
              />
            </div>
            {allowLoadingSearchBloat.current && (
              <SearchBloat
                query={query}
                locale={currentLocale}
                selectedFields={selectedFields}
                sortBy={sortBy}
                translations={translations}
              />
            )}
          </div>
        </div>
        <RangeButtonMemo
          someFilteringApplied={someFilteringApplied}
          isQueryEmpty={isQueryEmpty}
          showSelected={showSelected}
          translations={translations}
          onClick={onRangeButtonClick}
        />
      </div>
    </Fragment>
  );
}

export default function ChoiceBar({
  locale,
  translations,
  list,
}: {
  locale: string;
  translations: Record<string, string>;
  list: IssueStub[];
}) {
  let [minYear, maxYear] = useMemo(() => computeMinAndMaxYear(list), [list]);

  const [showSelected, setShowSelected] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(minYear);
  const [selectedTo, setSelectedTo] = useState(maxYear);

  const someFilteringApplied = selectedFrom != minYear || selectedTo != maxYear;

  const listFiltered = list.filter(
    (issue: IssueStub) =>
      issue.year >= selectedFrom && issue.year <= selectedTo,
  );

  const onRangeButtonClick = () => {
    if (showSelected) {
      setShowSelected(false);
      setSelectedFrom(minYear);
      setSelectedTo(maxYear);
    } else {
      setShowSelected(true);
    }
  };

  return (
    <Fragment>
      <SearchMagic
        translations={translations}
        list={list}
        locale={locale}
        someFilteringApplied={someFilteringApplied}
        showSelected={showSelected}
        onRangeButtonClick={onRangeButtonClick}
      />
      {showSelected ? (
        <div className="order-3 h-[240px] overflow-hidden transition-[height]">
          <YearPicker
            minYear={minYear}
            maxYear={maxYear}
            selectedFrom={selectedFrom}
            selectedTo={selectedTo}
            setSelectedFrom={setSelectedFrom}
            setSelectedTo={setSelectedTo}
            editionsCount={listFiltered.length}
            locale={locale}
            translations={translations}
          />
        </div>
      ) : (
        <div className="order-3 h-0 transition-[height]" />
      )}
      <div
        className="order-4 flex w-full items-center justify-start px-0 pb-4 pt-1 sm:px-5 sm:pt-2
          xs:px-1.5">
        <IssuesList
          list={listFiltered}
          locale={locale}
          latestSlug={list[0]?.slug}
        />
      </div>
    </Fragment>
  );
}

const SearchIcon = () => (
  <span className="ml-1 mr-2.5">
    <svg
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      className="flex-none">
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
  </span>
);

const IconFilter = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="mx-2 h-5 w-5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0
             01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0
             01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25
             0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
    />
  </svg>
);

const IconBackspace = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="mr-2 h-6 w-6">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
    />
  </svg>
);

const IconClear = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.2}
    stroke="currentColor"
    className="mx-1.5 h-5 w-5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);
