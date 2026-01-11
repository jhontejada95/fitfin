export const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value || 0);

export const parseCOPInput = (raw: string) => {
  const sanitized = raw.replace(/[^0-9]/g, '');
  return Number(sanitized || 0);
};
