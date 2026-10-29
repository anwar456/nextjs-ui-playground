const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

// 12500 -> "Rp 12.500". Intl puts a non-breaking space between "Rp" and the
// number; swap it for a normal space so the text is exactly "Rp 12.500".
export function formatIdr(amount: number): string {
  return idr.format(amount).replace(/ /g, " ");
}
