// @ts-nocheck
// TODO
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';
import typographyPlugin from '@tailwindcss/typography';
import headlessuiPlugin from '@headlessui/tailwindcss';
import plugin from 'tailwindcss/plugin';
// import withAlphaVariable from 'tailwindcss/lib/util/withAlphaVariable';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
// import createUtilityPlugin from 'tailwindcss/lib/util/createUtilityPlugin';
import { parseColor, formatColor } from 'tailwindcss/lib/util/color';

const tick = {
  '0%': {
    'stroke-dasharray': '0 45',
    'stroke-dashoffset': '0',
    'transform': 'translateX(0)',
  },
  '25%': {
    'stroke-dasharray': '17.65843200683594 23.06675720214844',
    'stroke-dashoffset': '0',
    'transform': 'translateX(0)',
  },
  '55%': {
    'stroke-dasharray': '24.710262298583984 16.0149269104004',
    'stroke-dashoffset': '-16.0149269104004',
  },
  '100%': {
    'stroke-dasharray': '24.710262298583984 16.0149269104004',
    'stroke-dashoffset': '-10.6066017150879',
    'transform': 'translateX(8px)',
  },
};

const tick_back = {
  '0%': {
    'stroke-dasharray': '0 45',
    'stroke-dashoffset': '0',
    'transform': 'translateX(0)',
  },
  '100%': {
    'stroke-dasharray': '24.710262298583984 16.0149269104004',
    'stroke-dashoffset': '-10.6066017150879',
    'transform': 'translateX(8px)',
  },
};

const pulse = {
  '75%, 100%': {
    transform: 'scale(2)',
    opacity: '0',
  },
};

export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/[locale]/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      dropShadow: {
        sb: ['4px 3px 4px rgba(0, 0, 0, 0.08)'],
      },
      animation: {
        'my-pulse': 'my-pulse 2s linear cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1s ease-in-out infinite',
      },
      keyframes: {
        tick,
        'tick-back': tick_back,
        'my-pulse': pulse,
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'enable-pointer-events': {
          '0%, 99%': {
            'pointer-events': 'none',
          },
          '100%': {
            'pointer-events': 'auto',
          },
        },
      },
      screens: {
        us: '360px',
        xs: '420px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        lx: '1200px',
        xl: '1280px',
        maxwsm: { 'raw': '(max-width: 640px) or (max-height: 640px)' },
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        'allvpv': 'cubic-bezier(0,1,0.5,1)',
        'allvpv-rev': 'cubic-bezier(0.5,0,1,0)',
      },
      colors: {
        'default': {
          25: '#FCFAF9',
          50: '#F8F4F2',
          75: '#F0EBE8',
          100: '#E8E1DE',
          150: '#DCD4D0',
          200: '#D0C7C3',
          225: '#C9C0BC',
          250: '#C3BAB6',
          300: '#B6ADAA',
          400: '#9D9490',
          500: '#837A77',
          600: '#6A605D',
          700: '#554944',
          800: '#3C332F',
          850: '#2F2825',
          900: '#221D1C',
          950: '#161210',
        },
        'accent-dark': colors.amber,
        'accent-light': colors.red,
        'accent-dark-link-handpicked': '#CE9F35',
        'button-bibtex-handpicked-light': '#504A47',
      },
      fontFamily: {
        sans: ['var(--default-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--default-serif)', ...defaultTheme.fontFamily.serif],
        mono: ['var(--default-mono)', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        baseplus: '1.05rem',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
      },
      typography: (theme: any) => ({
        default: {
          css: {
            '--tw-prose-body': theme('colors.default.600'),
            '--tw-prose-headings': theme('colors.default.700'),
            '--tw-prose-lead': theme('colors.default.500'),
            '--tw-prose-links': theme('colors.default.700'),
            '--tw-prose-bold': theme('colors.default.700'),
            '--tw-prose-counters': theme('colors.default.400'),
            '--tw-prose-bullets': theme('colors.default.400'),
            '--tw-prose-hr': theme('colors.default.100'),
            '--tw-prose-quotes': theme('colors.default.600'),
            '--tw-prose-quote-borders': theme('colors.default.200'),
            '--tw-prose-captions': theme('colors.default.400'),
            '--tw-prose-code': theme('colors.default.600'),
            '--tw-prose-pre-code': theme('colors.default.100'),
            '--tw-prose-pre-bg': theme('colors.default.800'),
            '--tw-prose-th-borders': theme('colors.default.200'),
            '--tw-prose-td-borders': theme('colors.default.100'),
            '--tw-prose-invert-body': `${theme('colors.default.300')}`,
            '--tw-prose-invert-headings': theme('colors.default.200'),
            '--tw-prose-invert-lead': theme('colors.default.400'),
            '--tw-prose-invert-links': theme('colors.default.200'),
            '--tw-prose-invert-bold': theme('colors.default.200'),
            '--tw-prose-invert-counters': theme('colors.default.400'),
            '--tw-prose-invert-bullets': theme('colors.default.600'),
            '--tw-prose-invert-hr': theme('colors.default.700'),
            '--tw-prose-invert-quotes': theme('colors.default.100'),
            '--tw-prose-invert-quote-borders': theme('colors.default.700'),
            '--tw-prose-invert-captions': theme('colors.default.400'),
            '--tw-prose-invert-code': theme('colors.default.300'),
            '--tw-prose-invert-pre-code': theme('colors.default.400'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.default.600'),
            '--tw-prose-invert-td-borders': theme('colors.default.700'),
          },
        },
        bw: {
          css: {
            '--tw-prose-body': '#000',
            '--tw-prose-headings': '#000',
            '--tw-prose-lead': '#000',
            '--tw-prose-links': '#000',
            '--tw-prose-bold': '#000',
            '--tw-prose-counters': '#000',
            '--tw-prose-bullets': '#000',
            '--tw-prose-hr': '#000',
            '--tw-prose-quotes': '#000',
            '--tw-prose-quote-borders': '#fff',
            '--tw-prose-captions': '#ff',
            '--tw-prose-code': '#000',
            '--tw-prose-pre-code': '#fff',
            '--tw-prose-pre-bg': '#000',
            '--tw-prose-th-borders': '#fff',
            '--tw-prose-td-borders': '#fff',
          },
        },
      }),
    },
  },
  plugins: [
    typographyPlugin,
    headlessuiPlugin,
    plugin(({ matchVariant, matchUtilities, addVariant, addUtilities }) => {
      addVariant('not-supports-lh', '@supports not (height: 1lh)');
      addVariant('hoverable', '@media (hover: hover) and (pointer: fine)');
      addVariant('not-last', '&:not(:last-child)');
      addVariant('dark', '.dark &');
      addVariant('light', '.light &');

      addVariant('mono', [`.bw &`, `.wb &`]);

      matchUtilities({
        gr: (value) => ({
          [`@apply ${value.replaceAll(',', ' ')}`]: {},
        }),
      });

      matchUtilities({
        'transition-pass': (value) => {
          return {
            transition: value,
          };
        },
      });
    }),
  ],
};
