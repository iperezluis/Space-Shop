export const format = (value: number) => {
  const formater = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formater.format(value); //$2.500,00
};
