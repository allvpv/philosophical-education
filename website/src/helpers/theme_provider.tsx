'use client';

import { ThemeProvider } from 'next-themes';

export default function ThemeProviderClient({
  children,
  themes,
}: {
  children: React.ReactNode;
  themes: string[];
}) {
  return (
    <ThemeProvider
      attribute="class"
      themes={themes}
      disableTransitionOnChange={true}>
      {children}
    </ThemeProvider>
  );
}
