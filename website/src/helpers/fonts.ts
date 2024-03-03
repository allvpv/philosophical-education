import { Inter, Fira_Code, Source_Serif_4 } from 'next/font/google';

// Font loader calls must be assigned to a const at the module scope.
// Font loader values must be explicitly written literals.
const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--default-sans',
  display: 'swap',
});

const mono = Fira_Code({
  subsets: ['latin', 'latin-ext'],
  fallback: [
    'JetBrains Mono',
    'Victor Mono',
    'Inconsolate',
    'Consolas',
    'Courier New',
  ],
  variable: '--default-mono',
  display: 'swap',
});

const serif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'Courier New'],
  variable: '--default-serif',
  display: 'swap',
});

const installedFonts = [sans, serif, mono];

export default installedFonts;
