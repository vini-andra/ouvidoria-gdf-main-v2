/**
 * Utilitários para formatação de telefone brasileiro
 */

export function formatTelefone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export function unformatTelefone(value: string): string {
  return value.replace(/\D/g, '');
}

export function validateTelefone(telefone: string): boolean {
  const cleanTelefone = unformatTelefone(telefone);
  // Telefone brasileiro: 10 ou 11 dígitos (com DDD)
  return cleanTelefone.length >= 10 && cleanTelefone.length <= 11;
}
