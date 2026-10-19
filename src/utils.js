export const ALL = 'All';

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

export const formatPrice = (value) => peso.format(Number(value));

export const uniqueSorted = (items, key) =>
  [...new Set(items.map((item) => item[key]))].sort((a, b) => a.localeCompare(b));
