export const formatCurrency = (amount, currency = "VND", locale = "vi-VN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};
