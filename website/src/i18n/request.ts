import { getRequestConfig } from 'next-intl/server';
import { routing, locales } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale)) {
    locale = 'pl';
  }

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    locale,
  };
});
