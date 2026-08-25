export function formatFees(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN');
}
