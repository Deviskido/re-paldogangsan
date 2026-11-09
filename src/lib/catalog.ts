import data from '../../data/catalog.json';
import type { Product } from '../types/product';
import type { Mall } from '../types/mall';

export const products: Product[] = data.products;
export const isSample = data.mode === 'sample';
export const updatedAt = data.updated_at;
export const malls: Mall[] = (data.malls as Mall[]).map(mall => ({ ...mall, product_count: products.filter(product => product.mall_id === mall.id).length }));
export const categories = Array.from(new Set(products.flatMap(product => product.categories))).sort((a, b) => a.localeCompare(b, 'ko'));
export const categoryCounts = Object.fromEntries(categories.map(category => [category, products.filter(product => product.categories.includes(category)).length]));
export function safeExternalUrl(value: string): string | undefined {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
