export function formatEuro(cents: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(cents / 100);
}

export function spiceLabel(level: number) {
  if (level <= 0) return "No spice";
  if (level === 1) return "Mild";
  if (level === 2) return "Medium";
  return "Hot";
}
