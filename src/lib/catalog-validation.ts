import type { Product } from '../types/product';
import type { Mall } from '../types/mall';
import { REGION_NAMES } from '../types/mall';

export interface Catalog { mode: 'sample' | 'live'; updated_at: string; products: Product[]; malls: Mall[] }
function check(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function object(value: unknown): asserts value is Record<string, unknown> { check(value && typeof value === 'object' && !Array.isArray(value), '객체가 필요합니다'); }
function date(value: unknown) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)); }
function url(value: unknown) { try { return typeof value === 'string' && ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } }
function image(value: unknown) { return typeof value === 'string' && (/^\/(?!\/)/.test(value) || url(value)); }
function strings(value: unknown) { return Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim()); }
function textFields(value: Record<string, unknown>, fields: string[]) { for (const field of fields) check(typeof value[field] === 'string' && (value[field] as string).trim(), `${field}: 비어 있지 않은 문자열이 필요합니다`); }
export function validateCatalog(input: unknown): Catalog {
  object(input);
  check(input.mode === 'sample' || input.mode === 'live', 'mode는 sample 또는 live입니다');
  check(date(input.updated_at), 'updated_at 날짜 오류');
  check(Array.isArray(input.products) && Array.isArray(input.malls), 'products/malls 배열이 필요합니다');
  const mallIds = new Map<string, string>();
  for (const mall of input.malls) {
    object(mall); textFields(mall, ['id', 'name', 'engname', 'region']);
    check(!mallIds.has(mall.id as string), '중복 쇼핑몰 ID');
    check(Object.hasOwn(REGION_NAMES, mall.region as string), '쇼핑몰 지역 오류');
    check(url(mall.url), '쇼핑몰 URL 오류');
    check(date(mall.last_updated), '쇼핑몰 날짜 오류');
    check(['active', 'inactive', 'error'].includes(mall.status as string), '쇼핑몰 상태 오류');
    check(Number.isInteger(mall.product_count) && (mall.product_count as number) >= 0, '쇼핑몰 상품 수 오류');
    if (mall.logo_url !== undefined) check(image(mall.logo_url), '로고 URL 오류');
    if (mall.description !== undefined) check(typeof mall.description === 'string', '설명 오류');
    if (mall.categories !== undefined) check(strings(mall.categories), '쇼핑몰 카테고리 오류');
    for (const key of ['opening_year', 'featured_products']) if (mall[key] !== undefined) check(Number.isInteger(mall[key]) && (mall[key] as number) >= 0, `${key} 오류`);
    mallIds.set(mall.id as string, mall.region as string);
  }
  const productIds = new Set<string>();
  for (const product of input.products) {
    object(product); textFields(product, ['id', 'name', 'mall_id', 'mall_name', 'mall_engname', 'mall_region', 'search_text']);
    check(!productIds.has(product.id as string), '중복 상품 ID'); productIds.add(product.id as string);
    check(mallIds.has(product.mall_id as string), '연결된 쇼핑몰이 없습니다');
    check(mallIds.get(product.mall_id as string) === product.mall_region, '쇼핑몰 지역 불일치');
    check(typeof product.price === 'number' && Number.isFinite(product.price) && product.price >= 0, '가격 오류');
    check(url(product.product_url) && image(product.image_url), '상품 URL 오류');
    check(strings(product.categories), '상품 카테고리 오류');
    check(date(product.created_at), '상품 날짜 오류');
  }
  return input as unknown as Catalog;
}
