import * as React from 'react';

export type NavItem = {
  href: string;
  text: string;
  matchPrefix: string;
};

export type Translator = (key: string) => string;

//
// About/Content
//
export type ContentData = {
  pagesMetadata: Map<number, PageMetadata>;
  categoriesMetadata: Map<number, CategoryMetadata>;
  pagesSlugToId: Map<string, number>;
};

export type IssueStub = {
  id: number;
  slug: string;
  label_en: string | null;
  label_pl: string | null;
  year: number;
};

export type IssuesList = {
  list: Array<IssueStub>;
  slugToId: Map<string, number>;
};

export type PageMetadata = {
  slug: string;
  title: string;
  categoryId: number;
};

export type CategoryMetadata = {
  title: string;
  pagesId: number[];
};

//
// Theme
//
export type ThemeInfo = {
  value: string;
  icon: React.ReactNode;
  display: string;
  icon_cond_class: string;
};

//
// HTML
//
type CustomHTMLElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

//
// Article, Issue
//
export type ArticleAuthor = {
  fullName: string;
  orcid: string;
  cejsh: string;
};

export type ArticleKeyword = {
  keyword: string;
};

export type ArticlePDFData = {
  url: string;
  name: string;
};

export type Article = {
  id: number;
  title_en: string;
  title_pl: string;
  pages: string;
  doi: string;
  authors: ArticleAuthor[];
  keywords_en: ArticleKeyword[] | null;
  keywords_pl: ArticleKeyword[] | null;
  number: number;
  PDF: ArticlePDFData | null;
  monoLang: string;
  bibtex_pl: string;
  bibtex_en: string;
};

export type Issue = {
  edited_by: string;
  volume: number;
  year: number;
  short_description_en: string | null;
  short_description_pl: string | null;
  long_description_en: string | null;
  long_description_pl: string | null;
  label_en: string;
  label_pl: string;
  articles: Article[];
  pdfUrl: string | null;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['abstract']: CustomHTMLElement;
      ['expandbuttonplaceholder']: CustomHTMLElement;
      ['expandbutton']: CustomHTMLElement;
      ['buttonarea']: CustomHTMLElement;
      ['textcontainer']: CustomHTMLElement;
      ['textpadding']: CustomHTMLElement;
      ['textofabstract']: CustomHTMLElement;
      ['fakebutton']: CustomHTMLElement;
      ['bibtexlines']: CustomHTMLElement;
      ['bibtextoolbar']: CustomHTMLElement;
      ['bibtexcontent']: CustomHTMLElement;
      ['bibtexlisting']: CustomHTMLElement;
      ['scrollgradient']: CustomHTMLElement;
    }
  }
}
