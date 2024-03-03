export function getThemesWithTranslation(t: (key: string) => string) {
  return themes.map((theme) => ({
    ...theme,
    display: t(theme.value),
  }));
}

const IconMoon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="colors-moon -mt-[1px] mb-[1px] h-6 w-6"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
      className="fill-accent"
    />
    <path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
    />
  </svg>
);

const IconSun = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="colors-sun h-[24px] w-[24px]"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      className="fill-accent"
      strokeWidth={2.3}
    />
    <path
      d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
      strokeWidth={2.6}
    />
  </svg>
);

const IconSettings = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="h-6 w-6">
    <path
      className="colors-toned-stroke"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.1}
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
    />
    <path
      className="colors-toned-stroke"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.3}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const IconBlackWhite = () => (
  <svg fill="none" viewBox="0 0 24 24" className="h-[22px] w-[22px]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      stroke="currentColor"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
  </svg>
);

const IconWhiteBlack = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    className="
      colors-eye h-[22px]
      w-[22px]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.0}
      fill="currentColor"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const themes = [
  {
    value: 'system',
    icon: <IconSettings />,
    icon_cond_class: '',
  },
  {
    value: 'dark',
    icon: <IconMoon />,
    icon_cond_class: 'hidden [.dark_&]:block [.wb_&]:block',
  },
  {
    value: 'light',
    icon: <IconSun />,
    icon_cond_class: 'hidden [.light_&]:block [.bw_&]:block',
  },
  {
    value: 'bw',
    icon: <IconBlackWhite />,
    icon_cond_class: '',
  },
  {
    value: 'wb',
    icon: <IconWhiteBlack />,
    icon_cond_class: '',
  },
];
