import type { Product } from '../types/product';
import { REGION_NAMES, type Region } from '../types/mall';

const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
export const normalize = (value: string) => value.normalize('NFC').toLowerCase().replace(/\s+/g, '');
export function toInitials(value: string): string {
  return Array.from(normalize(value), char => {
    const code = char.charCodeAt(0) - 0xac00;
    return code >= 0 && code <= 11171 ? initials[Math.floor(code / 588)] : char;
  }).join('');
}
export interface Filters { q?: string; region?: string; categories?: string[]; mode?: string; sort?: string }
export function discover(products: Product[], filters: Filters = {}): Product[] {
  const query = normalize(filters.q || '');
  const consonants = query.length > 0 && Array.from(query).every(char => initials.includes(char));
  const result = products.filter(product => {
    const fields = [product.name, product.mall_name, product.search_text, REGION_NAMES[product.mall_region as Region] || '', ...product.categories];
    if (query && !fields.some(field => (consonants ? toInitials(field) : normalize(field)).includes(query))) return false;
    if (filters.region && product.mall_region !== filters.region) return false;
    const categories = filters.categories || [];
    return !categories.length || (filters.mode === 'AND' ? categories.every(cat => product.categories.includes(cat)) : categories.some(cat => product.categories.includes(cat)));
  });
  if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (filters.sort === 'newest') result.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  return result;
}
