import '@/style.css';

import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Fonts from '@/helpers/fonts';
import Header from '@/widgets/header';
import { themes } from '@/helpers/themes';
import { locales } from '@/i18n/routing';

import ThemeProviderClient from '@/helpers/theme_provider';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const fonts = Fonts.map((f) => f.variable).join(' ');

  return (
    <html lang={locale} className="light" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48 64x64" />
        <link rel="apple-touch-icon" href="/touchicon.png" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className={`colors-body-background font-sans ${fonts}`}>
        <ThemeProviderClient themes={themes.map((theme) => theme.value)}>
          <main className="flex min-h-[max(100dvh,768px)] flex-col pt-[64px]">
            <header className="fixed top-0 z-[99] order-[100] h-[64px] w-full backdrop-blur">
              <Header locale={locale} />
            </header>
            {children}
            <Footer />
          </main>
        </ThemeProviderClient>
      </body>
    </html>
  );
}

// TODO: parse markdown from strapi here
const Footer = () => (
  <footer className="order-[200] mt-auto max-h-full w-full overflow-hidden">
    <div className="colors-background prose-tweaked w-full">
      <div className="colors-border-footer colors-footer mx-auto max-w-7xl">
        <div
          className="justify-items-between mx-[5%] grid auto-cols-min grid-flow-row justify-between
            gap-x-7 gap-y-7 px-3 py-10 sm:grid-cols-[1fr_1fr] md:mx-[calc(11%-4.25rem)]
            lg:grid-cols-[1fr_1fr_1fr] lg:grid-rows-1">
          <div className="whitespace-nowrap">
            półrocznik/semi-annual
            <br />
            <q>Edukacja Filozoficzna</q>
            <br />
            ISSN 3860-3839
            <br />
          </div>

          <div className="justify-self-end whitespace-nowrap md:justify-self-center">
            Wydział Filozofii UW
            <br />
            ul. Krakowskie Przedmieście 3, pok. 302
            <br />
            00-927 Warszawa
          </div>

          <div className="whitespace-nowrap lg:justify-self-end">
            <a href="mailto:edukacjafilozoficzna@uw.edu.pl">
              edukacjafilozoficzna@uw.edu.pl
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
