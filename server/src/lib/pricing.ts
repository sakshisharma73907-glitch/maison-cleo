export const TAX_RATE = 0.0825;
export const SHIPPING_FLAT = 12;
export const FREE_SHIPPING_THRESHOLD = 250;

export type TotalBreakdown = {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function computeTotals(
  lines: { price: number; quantity: number }[],
): TotalBreakdown {
  const subtotal = round2(
    lines.reduce((acc, l) => acc + l.price * l.quantity, 0),
  );
  const tax = round2(subtotal * TAX_RATE);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = round2(subtotal + tax + shipping);
  return { subtotal, tax, shipping, total };
}