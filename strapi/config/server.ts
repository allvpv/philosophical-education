export default ({ env }) => ({
  host: env('HOST', undefined),
  port: env.int('PORT', undefined),
  url: env('WEBSITE', undefined),
  dirs: {
    public: env('PUBLIC', './public'),
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
