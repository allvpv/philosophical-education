import qs from 'qs';
import sanitizeHtml from 'sanitize-html';

import { parse } from 'marked';
import {
  ContentData,
  IssuesList,
  Issue,
  IssueStub,
  Article,
  ArticleAuthor,
  ArticleKeyword,
  ArticlePDFData,
} from './types';

import getBibTeXForArticle from './get_bibtex';
import { slugifyIssue } from '@/slugify';

const STRAPI_KEY = process.env.STRAPI_SECRET_KEY;
const STRAPI_URL =
  process.env.STRAPI_URL_INTERNAL || process.env.NEXT_PUBLIC_STRAPI_URL;

type StrapiData<T> = {
  data: T;
};

type StrapiEntry<T> = {
  id: number;
  attributes: T;
};

///

type StrapiArticleKeyword = StrapiEntry<{
  locale: string;
  keyword: string;
}>;

type StrapiArticleAuthor = StrapiEntry<{
  fullname: string;
  orcid: string;
  cejsh: string;
}>;

type StrapiArticlePdf = StrapiEntry<{
  name: string;
  url: string;
}>;

type StrapiArticle = StrapiEntry<{
  title_en: string;
  title_pl: string;
  doi: string;
  abstract_pl: string;
  abstract_en: string;
  pages: string;
  authors: StrapiData<Array<StrapiArticleAuthor>>;
  keywords: StrapiData<Array<StrapiArticleKeyword>>;
  pdf: StrapiData<StrapiArticlePdf>;
}>;

///

type StrapiIssue = StrapiEntry<{
  editors: string;
  volume: number;
  year: number;
  short_description_en: string;
  short_description_pl: string;
  long_description_en: string;
  long_description_pl: string;
  label_en: string;
  label_pl: string;
  articles: StrapiData<Array<StrapiArticle>>;
}>;

type StrapiIssueStub = StrapiEntry<{
  label_en: string | null;
  label_pl: string | null;
  slug: string;
  year: number;
}>;

type StrapiIssuesList = Array<StrapiIssueStub>;

///

type StrapiCategory = {
  id: number;
  attributes: {
    name: string;
    posts: {
      data: {
        id: number;
      }[];
    };
  };
};

type StrapiCategories = {
  id: number;
  attributes: {
    categories: {
      data: StrapiCategory[];
    };
  };
};

type StrapiPageMetadata = {
  id: number;
  attributes: {
    slug: string;
    title: string;
  };
};

type StrapiPageContent = {
  id: number;
  attributes: {
    html: string;
  };
};

///

const sanitizeHtmlOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    figure: ['class'],
    ...sanitizeHtml.defaults.allowedAttributes,
  },
};

async function getFromStrapi<T>(query: string): Promise<T> {
  const headers = {
    Authorization: 'Bearer ' + STRAPI_KEY,
  };

  const url = `${STRAPI_URL}/api/${query}`;

  return await fetch(url, {
    method: 'GET',
    headers,
    next: {
      revalidate: 60,
    },
  })
    .then((response) => response.json())
    .then((response: StrapiData<T>) => response.data);
}

export async function getIssuesList(): Promise<IssuesList> {
  const query =
    'issues?' +
    qs.stringify({
      fields: ['label_en', 'label_pl', 'year', 'volume', 'id'],
      sort: ['year', 'volume', 'label_pl'],
      pagination: {
        limit: 400, // 200 years...
      },
    });

  const response: StrapiIssueStub[] = await getFromStrapi<StrapiIssuesList>(
    query,
  ).then((data) => data.reverse());

  const list: IssueStub[] = response.map((issue: StrapiIssueStub) => ({
    id: issue.id,
    slug: slugifyIssue(issue.attributes.label_en, issue.attributes.label_pl),
    label_en: issue.attributes.label_en,
    label_pl: issue.attributes.label_pl,
    year: issue.attributes.year,
  }));

  const slugToId = new Map(
    list.map((issue: IssueStub) => [issue.slug, issue.id]),
  );

  return { list, slugToId };
}

export async function getIssue(issueId: number): Promise<Issue> {
  const query =
    `issues/${issueId}?` +
    qs.stringify({
      populate: {
        articles: {
          fields: [
            'title_en',
            'title_pl',
            'doi',
            'abstract_pl',
            'abstract_en',
            'pages',
          ],
          populate: {
            authors: {
              fields: ['fullname', 'orcid', 'cejsh'],
            },
            keywords: {
              fields: ['keyword', 'locale'],
            },
            pdf: {
              fields: ['name', 'url'],
            },
          },
        },
      },
    });

  let response = await getFromStrapi<StrapiIssue>(query);

  let articles: Article[] = response.attributes.articles.data.map(
    (article: StrapiArticle, order: number) => {
      let keywords_en = article.attributes.keywords.data
        .filter(
          (keyword: StrapiArticleKeyword) => keyword.attributes.locale === 'en',
        )
        .map((keyword: StrapiArticleKeyword) => ({
          keyword: keyword.attributes.keyword,
        }));

      let keywords_pl = article.attributes.keywords.data
        .filter(
          (keyword: StrapiArticleKeyword) => keyword.attributes.locale === 'pl',
        )
        .map((keyword: StrapiArticleKeyword) => ({
          keyword: keyword.attributes.keyword,
        }));

      let PDFData = article.attributes?.pdf?.data?.attributes;
      let hasPDFData = !!PDFData?.url && !!PDFData?.name;

      let data = {
        id: article.id,
        title_en: article.attributes.title_en,
        title_pl: article.attributes.title_pl,
        pages: article.attributes.pages,
        doi: article.attributes.doi,
        authors: article.attributes.authors.data.map(
          (data: StrapiArticleAuthor) => ({
            fullName: data.attributes.fullname,
            orcid: data.attributes.orcid,
            cejsh: data.attributes.cejsh,
          }),
        ),
        sanitized_abstract_en: article.attributes.abstract_en
          ? sanitizeHtml(
              parse(article.attributes.abstract_en) as string,
              sanitizeHtmlOptions,
            )
          : null,
        sanitized_abstract_pl: article.attributes.abstract_pl
          ? sanitizeHtml(
              parse(article.attributes.abstract_pl) as string,
              sanitizeHtmlOptions,
            )
          : null,
        keywords_en: !keywords_en.length ? null : keywords_en,
        keywords_pl: !keywords_pl.length ? null : keywords_pl,
        number: order,
        PDF: hasPDFData
          ? {
              url: String(PDFData.url),
              name: String(PDFData.name),
            }
          : null,
        monoLang: '',
        bibtex_pl: '',
        bibtex_en: '',
      };

      if (!data.title_en && !data.sanitized_abstract_en && !data.keywords_en) {
        data.monoLang = 'en';
      } else if (
        !data.title_pl &&
        !data.sanitized_abstract_pl &&
        !data.keywords_pl
      ) {
        data.monoLang = 'pl';
      }

      return data;
    },
  );

  let issue = {
    edited_by: response.attributes.editors,
    volume: response.attributes.volume,
    year: response.attributes.year,
    short_description_en: response.attributes.short_description_en,
    short_description_pl: response.attributes.short_description_pl,
    long_description_en: response.attributes.long_description_en,
    long_description_pl: response.attributes.long_description_pl,
    label_en: response.attributes.label_en,
    label_pl: response.attributes.label_pl,
    articles: articles,
  };

  for (const article of issue.articles) {
    article.bibtex_pl = getBibTeXForArticle(issue, article, 'pl');
    article.bibtex_en = getBibTeXForArticle(issue, article, 'en');
  }

  return issue;
}

export async function getContentMetadata(locale: string): Promise<ContentData> {
  const queryPagesMetadata =
    'posts?' +
    qs.stringify({
      fields: ['slug', 'title'],
      locale,
    });

  const queryCategories =
    'order-category?' +
    qs.stringify({
      fields: ['id'],
      populate: {
        categories: {
          fields: ['name'],
          populate: {
            posts: {
              fields: ['id'],
            },
          },
        },
      },
      locale,
    });

  let [strapiCategories, strapiPagesMetadata] = await Promise.all([
    getFromStrapi<StrapiCategories>(queryCategories).then(
      (data) => data.attributes.categories.data,
    ),
    getFromStrapi<Array<StrapiPageMetadata>>(queryPagesMetadata),
  ]);

  let categoriesMetadata = new Map(
    strapiCategories.map((category: StrapiCategory) => [
      Number(category.id),
      {
        title: String(category.attributes.name),
        pagesId: category.attributes.posts.data.map(({ id }) => Number(id)),
      },
    ]),
  );

  let pagesMetadata = new Map(
    strapiPagesMetadata.map((metadata) => {
      let categoryId =
        strapiCategories.find(
          (category) =>
            category.attributes.posts.data.findIndex(
              (page) => page.id === metadata.id,
            ) !== -1,
        )?.id ?? -1;

      return [
        Number(metadata.id),
        {
          slug: String(metadata.attributes.slug),
          title: String(metadata.attributes.title),
          categoryId: Number(categoryId),
        },
      ];
    }),
  );

  let pagesSlugToId = new Map(
    strapiPagesMetadata.map((metadata) => [
      metadata.attributes.slug,
      metadata.id,
    ]),
  );

  let contentData = {
    pagesMetadata,
    categoriesMetadata,
    pagesSlugToId,
  };

  return contentData;
}

export function getSanitizedPageContent(
  id: number,
  locale: string,
): Promise<string> {
  const queryPage = `posts/${id}?${qs.stringify({
    fields: ['html'],
  })}`;

  return getFromStrapi<StrapiPageContent>(queryPage).then((content) =>
    sanitizeHtml(content.attributes.html, sanitizeHtmlOptions),
  );
}
