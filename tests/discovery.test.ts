import assert from 'node:assert/strict';
import { discover, toInitials } from '../src/lib/discovery';
import { validateCatalog } from '../src/lib/catalog-validation';
import data from '../data/catalog.json';

const { products } = validateCatalog(data);
assert.equal(discover(products).length, products.length);
assert.equal(discover(products, { q: 'ㅎㅇ' })[0]?.name, '한우 등심 500g');
assert.equal(discover(products, { q: '제주감귤' })[0]?.name, '제주 감귤 3kg');
assert.equal(discover(products, { q: ' JEJU ' })[0]?.name, '제주 감귤 3kg');
assert.equal(discover(products, { q: '[' }).length, 0);
assert.equal(discover(products, { q: '한우', region: 'busan' }).length, 0);
assert.equal(discover(products, { region: 'seoul', categories: ['농산물', '과일'], mode: 'AND' }).length, 1);
assert.equal(discover(products, { categories: ['과일', '정육'], mode: 'OR' }).length, 2);
assert.equal(discover(products, { categories: ['과일', '정육'], mode: 'AND' }).length, 0);
assert.deepEqual(discover(products, { sort: 'price-desc' }).map(p => p.price), [45000, 25000, 15000]);
assert.equal(toInitials('까 따 빠 싸 짜'), 'ㄲㄸㅃㅆㅉ');
for (const change of [
  (c: any) => { c.products[0].price = NaN; },
  (c: any) => { c.products[0].product_url = 'javascript:alert(1)'; },
  (c: any) => { c.products[0].mall_id = 'missing'; },
  (c: any) => { c.products.push(c.products[0]); },
  (c: any) => { c.malls[0].region = 'invalid'; },
  (c: any) => { c.products[0].categories = [1]; },
]) { const copy = structuredClone(data); change(copy); assert.throws(() => validateCatalog(copy)); }
console.log('검색·복합 필터·정렬·초성·데이터 검증 회귀 테스트 통과');
