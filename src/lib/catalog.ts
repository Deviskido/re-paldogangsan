import data from '../../data/catalog.json';
import type { Product } from '../types/product';
import type { Mall } from '../types/mall';
import directory from '../../data/malls.json';
import { parseMallDirectory } from './mall-directory';

export const products: Product[] = data.products;
export const isSample = data.mode === 'sample';
export const updatedAt = data.updated_at;
// Sample shops belong only to sample products, never to the real directory.
export const malls = parseMallDirectory(directory).map(mall => {
  const linkedIds = new Set((data.malls as Mall[]).filter(item => item.id === mall.id || item.engname === mall.engname).map(item => item.id));
  return { ...mall, product_count: isSample ? 0 : products.filter(product => linkedIds.has(product.mall_id)).length };
});
export const mallCountsByRegion = malls.reduce<Record<string, number>>((counts, mall) => {
  counts[mall.region] = (counts[mall.region] || 0) + 1;
  return counts;
}, {});
export const categories = Array.from(new Set(products.flatMap(product => product.categories))).sort((a, b) => a.localeCompare(b, 'ko'));
export const categoryCounts = Object.fromEntries(categories.map(category => [category, products.filter(product => product.categories.includes(category)).length]));
export function safeExternalUrl(value: string): string | undefined {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
