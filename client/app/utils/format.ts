export const formatNumber = (value: string | number | null): string => {
  if (!value || isNaN(Number(value))) return "0";
  return Number(value).toLocaleString();
};

export const formatOutletName = (outlet: string): string => {
  return outlet.replace(/_/g, " ").toUpperCase();
};