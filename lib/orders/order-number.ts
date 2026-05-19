export function createOrderNumber(date = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(date)
    .replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `BH-${day}-${suffix}`;
}
