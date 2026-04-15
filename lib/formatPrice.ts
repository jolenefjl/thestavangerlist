/**
 * Normalises price-range values for display.
 *
 * Historically, price tiers were stored as "€", "€€", "€€€". The schema now
 * uses "kr", "kr kr", "kr kr kr", but existing published documents still hold
 * the euro strings — this helper converts them on the fly so both render as
 * Norwegian kroner without requiring a content migration.
 *
 * "Free" and any other free-form value pass through untouched.
 */
export function formatPrice(value?: string | null): string {
  if (!value) return "";
  const euroCount = (value.match(/€/g) ?? []).length;
  if (euroCount > 0) return Array(euroCount).fill("kr").join(" ");
  return value;
}
