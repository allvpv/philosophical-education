import nextIntlPlugin from 'next-intl/plugin';

const withNextIntl = nextIntlPlugin('./i18n.ts');

export default withNextIntl({
    output: 'standalone',
    distDir: 'builds/current',
    async redirects() {
        return [
          {
            source: '/pl/archive',
            destination: '/pl/archive/latest',
            permanent: true,
          },
          {
            source: '/en/archive',
            destination: '/en/archive/latest',
            permanent: true,
          },
        ]
    }
});
