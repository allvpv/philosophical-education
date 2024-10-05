export default ({ env }) => ({
  'ckeditor': {
    enabled: true,
    resolve: './src/plugins/ckeditor'
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: env('GMAIL_ACCOUNT_PASSWORD_RESET'),
          pass: env('GMAIL_SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('GMAIL_ACCOUNT_PASSWORD_RESET'),
        defaultReplyTo: env('GMAIL_ACCOUNT_PASSWORD_RESET'),
      },
    },
  },
  'meilisearch': {
    config: {
      host: env('MEILI_LOCAL_URL', undefined),
      apiKey: env('MEILI_MASTER_KEY', undefined),
      article: {
        settings: {
          sortableAttributes: ['order'],
          rankingRules: [
            "words",
            "typo",
            "sort",
            "proximity",
            "attribute",
            "exactness",
            "release_date:asc",
            "movie_ranking:desc"
          ],
        },
        transformEntry({ entry }) {
          const e = entry;
          const keywordsFlatEn = (
            e.keywords.filter(k => k.locale === 'en').map(k => k.keyword).join(', ')
          );
          const keywordsFlatPl = (
            e.keywords.filter(k => k.locale === 'pl').map(k => k.keyword).join(', ')
          );

          if (e.keywords.length > 0) {
            strapi.log.info(keywordsFlatEn);
            strapi.log.info(keywordsFlatPl);
          }

          return {
            id: e.id,
            title_en: e.title_en,
            title_pl: e.title_pl,
            doi: e.doi,
            abstract_en: e.abstract_en,
            abstract_pl: e.abstract_pl,
            pages: e.pages,
            pdf: (!e.pdf ? null : {
              name: e.pdf.name,
              url: e.pdf.url,
            }),
            keywords_en: keywordsFlatEn,
            keywords_pl: keywordsFlatPl,
            authors: e.authors.map(a => ({
              orcid: a.orcid,
              cejsh: a.cejsh,
              fullname: a.fullname,
            })),
            issue: (!e.issue ? null : {
              id: e.issue.id,
              label_en: e.issue.label_en,
              label_pl: e.issue.label_pl,
              year: e.issue.year,
              volume: e.issue.volume,
            }),
            order: e.issue ? (
              parseInt(e.issue.year ? e.issue.year : 3000) * 1000 +
              parseInt(e.issue.volume ? e.issue.volume : 900)
            ) : (
              4000000
            ),
          };
        },
      },
    }
  },
})
