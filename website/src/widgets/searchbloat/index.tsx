import * as React from 'react';

import { createInfiniteHitsSessionStorageCache } from 'instantsearch.js/es/lib/infiniteHitsCache';

import { useRef, useMemo } from 'react';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { InstantSearch } from 'react-instantsearch';
import { useSearchBox, useInstantSearch } from 'react-instantsearch';

import { InfiniteHits } from '@/widgets/searchhit';

const meilisearchUrl = process.env.NEXT_PUBLIC_MEILISEARCH_URL as string;
const meilisearchKey = process.env.NEXT_PUBLIC_MEILISEARCH_KEY as string;

const { searchClient, setMeiliSearchParams } = instantMeiliSearch(
  meilisearchUrl,
  meilisearchKey,
  {
    placeholderSearch: false,
  },
);

let cache = createInfiniteHitsSessionStorageCache();

function Search({ newQuery }: { newQuery: string }) {
  const previousQuery = useRef('');
  const { refine } = useSearchBox();

  if (previousQuery.current !== newQuery) {
    previousQuery.current = newQuery;
    refine(newQuery);
  }

  return <React.Fragment />;
}

function NoResultsBoundary({ children, fallback }: any) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults({ translations }: any) {
  const { indexUiState } = useInstantSearch();

  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 125"
        version="1.1"
        className="h-20 w-20 [.dark_&]:fill-default-600 [.light_&]:fill-default-300">
        <g stroke="none" fillRule="evenodd">
          <path d="M74.9539986,14.8662896 C76.9069986,12.9132896 76.9069986,9.74728961 74.9539986,7.79528961 C73.0009986,5.84328961 69.8359986,5.84328961 67.8829986,7.79528961 L7.79499858,67.8822896 C5.84299858,69.8352896 5.84299858,73.0012896 7.79499858,74.9532896 C8.77199858,75.9292896 10.0509986,76.4182896 11.3309986,76.4182896 C12.6109986,76.4182896 13.8899986,75.9292896 14.8669986,74.9532896 L74.9539986,14.8662896 Z M69.7629986,64.1052896 C74.7559986,57.8772896 77.7489986,49.9772896 77.7489986,41.3742896 C77.7489986,37.0492896 76.9919986,32.9022896 75.6049986,29.0552896 C74.6459986,26.3972896 71.2049986,25.6862896 69.2069986,27.6852896 L69.0349986,27.8572896 C67.9539986,28.9382896 67.6349986,30.5402896 68.1439986,31.9812896 C69.5659986,36.0122896 70.1059986,40.4542896 69.5099986,45.0822896 C67.8829986,57.7332896 57.7319986,67.8832896 45.0809986,69.5102896 C40.4529986,70.1052896 36.0119986,69.5652896 31.9819986,68.1432896 C30.5399986,67.6352896 28.9379986,67.9532896 27.8579986,69.0342896 L27.6859986,69.2062896 C25.6869986,71.2042896 26.3979986,74.6462896 29.0559986,75.6042896 C32.9029986,76.9912896 37.0499986,77.7492896 41.3749986,77.7492896 C49.9779986,77.7492896 57.8779986,74.7552896 64.1049986,69.7622896 L88.1679986,93.8252896 C88.9499986,94.6062896 89.9729986,94.9962896 90.9969986,94.9962896 C92.0209986,94.9962896 93.0439986,94.6062896 93.8259986,93.8252896 C95.3879986,92.2622896 95.3879986,89.7302896 93.8259986,88.1682896 L69.7629986,64.1052896 Z M7.04299858,53.4072896 C5.56099858,49.1842896 4.83399858,44.6062896 5.03199858,39.8322896 C5.80899858,21.1022896 21.1029986,5.80828961 39.8319986,5.03228961 C44.6069986,4.83328961 49.1849986,5.56028961 53.4079986,7.04228961 C56.2029986,8.02328961 57.0589986,11.5472896 54.9649986,13.6412896 L54.9319986,13.6742896 C53.8269986,14.7792896 52.1889986,15.1032896 50.7139986,14.5862896 C46.6979986,13.1792896 42.2749986,12.6462896 37.6679986,13.2382896 C25.0169986,14.8652896 14.8659986,25.0162896 13.2389986,37.6672896 C12.6469986,42.2742896 13.1789986,46.6972896 14.5869986,50.7132896 C15.1039986,52.1882896 14.7799986,53.8262896 13.6749986,54.9312896 L13.6419986,54.9642896 C11.5479986,57.0582896 8.02399858,56.2022896 7.04299858,53.4072896 L7.04299858,53.4072896 Z" />
        </g>
      </svg>
      <p
        className="max-w-full overflow-hidden truncate px-4 sm:max-w-xl [.dark_&]:text-default-100
          [.light_&]:text-default-700">
        {translations['noResults']}
        <q className="font-semibold [.dark_&]:text-white [.light_&]:text-default-700">
          {indexUiState.query}
        </q>
        .
      </p>
    </div>
  );
}

function computeMicroHash(selectedFields: number[]) {
  return selectedFields
    .map((n) => 2 ** n)
    .reduce((s: number, n: number) => s + n);
}

function getIndexName(microHash: number, sortBy: number | null) {
  const prefix = 'article' + ':'.repeat(microHash);
  const suffix = sortBy !== null ? `order:${['asc', 'desc'][sortBy]}` : '';

  return prefix + suffix;
}

function updateMeiliSearchParams(
  selectedFields: number[],
  microHash: number,
  sortBy: number | null,
  indexName: React.MutableRefObject<string | null>,
) {
  const allMeiliFields = [
    ['authors.fullname', 'authors.cejsh', 'authors.orcid'],
    ['title_en', 'title_pl'],
    ['abstract_en', 'abstract_pl'],
    ['keywords_pl', 'keywords_en'],
    ['pages', 'pdf.name'],
  ];

  const selectedFieldsSorted = selectedFields.sort();
  const selectedMeiliFields = selectedFields
    .map((n: number) => allMeiliFields[n])
    .flat();

  setMeiliSearchParams({
    attributesToSearchOn: selectedMeiliFields,
  });

  // This must be strictly synchronized with setMeiliSearchParams() call
  // Otherwise mess happens...
  indexName.current = getIndexName(microHash, sortBy);
}

export default function SearchBloat({
  query,
  locale,
  selectedFields,
  sortBy,
  translations,
}: {
  query: string;
  locale: string;
  selectedFields: number[];
  sortBy: number | null;
  translations: Record<string, string>;
}) {
  // TODO: move `decode` methods to separate file and include them here as well
  const microHash = computeMicroHash(selectedFields);
  const indexName = useRef<string | null>(null);

  // What happens when user selects parameters relevant for search? Author,
  // etc... This *must execute*, even if the query is empty!! (New options have
  // to be set).
  //
  // useMemo is like useEffect, but happens before render as well! We need
  // this, because otherwise UI is not actually rendered after the first render
  // (because indexName.current is null and <></> is returned).
  useMemo(() => {
    updateMeiliSearchParams(selectedFields, microHash, sortBy, indexName);
  }, [microHash, sortBy]);

  if (!query || !indexName.current) {
    return <></>;
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName.current}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      initialUiState={{
        [indexName.current]: { query },
      }}>
      <Search newQuery={query} />
      <NoResultsBoundary fallback={<NoResults translations={translations} />}>
        <InfiniteHits locale={locale} cache={cache} />
      </NoResultsBoundary>
    </InstantSearch>
  );
}
