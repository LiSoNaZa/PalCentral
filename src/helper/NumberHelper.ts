export const isNumeric = (num: unknown) => {
  return (typeof num === 'string' && num.trim() !== '')
    ? Number.isFinite(+num)
    : Number.isFinite(num)
};

export const formatNumber = (val: number): string => {
  return val.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};