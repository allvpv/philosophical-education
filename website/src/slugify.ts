export const toSlug = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\W_]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};


export const slugifyIssue = (label_en: string | null, label_pl: string | null) => {
  return toSlug(label_en ?? label_pl ?? 'bug');
};
