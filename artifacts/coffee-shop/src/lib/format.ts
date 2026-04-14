export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatPaymentMethod = (method: string) => {
  const labels: Record<string, string> = {
    "credit-card": "Kredi/Banka Kartı",
    "digital-wallet": "Dijital Cüzdan",
    "gift-card": "Hediye Kartı",
  };

  return labels[method] ?? method;
};

export const formatDeliveryMethod = (method: string) =>
  method === "shipping" ? "Adrese Teslim" : "Mağazadan Teslim";