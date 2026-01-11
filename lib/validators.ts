export const validateNonNegative = (value: number) => (value < 0 ? 'No se permiten negativos.' : '');

export const validateRequired = (value: number) => (value === 0 ? 'Requerido.' : '');
