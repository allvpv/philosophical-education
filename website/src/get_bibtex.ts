// @ts-nocheck
// TODO: No types for 'citation-js'
import Cite from 'citation-js';
// Importing has side effects of adding the plugin to the base.
import __CitePluginBibTeX from '@citation-js/plugin-bibtex';
import { plugins } from '@citation-js/core';

export default function getBibTeXForArticle(issue, article, locale) {
  let csl = getCitationInCslJson(issue, article, locale);
  let output = Cite.plugins.output.format('biblatex', [csl]);

  return output;
}

function getCitationInCslJson(issue, article, locale) {
  let title;

  if (locale === 'pl') title = article.title_pl;
  else title = article.title_en;

  if (!title) title = article.title_en ?? article.title_pl ?? '';

  /*
   *@Article{Gili2020,
    author = "Gili, Luca",
    title = "I.M. Bocheński and Theophrastus’ Modal Logic",
    journal = "Edukacja Filozoficzna",
    volume = 70,
    number = 2,
    pages = "23–38",
    year = 2020,
    doi = "10.14394/edufil.2020.0014"
    }
   *
   */

  // Citation in CSL-JSON format.
  let csl = {};

  csl['type'] = 'article-journal';

  if (article.authors && article.authors.length > 0)
    csl['author'] = article.authors.map((author) => ({
      literal: author.fullName,
    }));

  if (title) csl['title'] = title;

  csl['container-title'] = 'Edukacja Filozoficzna';
  csl['journalAbbreviation'] = 'edufil';

  if (issue.volume) csl.volume = issue.volume;
  if (article.pages) csl.page = article.pages;
  if (issue.year) csl.issued = { 'date-parts': [[issue.year]] };
  if (article.doi) csl.DOI = article.doi;

  return csl;
}
