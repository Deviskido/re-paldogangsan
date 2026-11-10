import assert from 'node:assert/strict';
import source from '../data/malls.json';
import { parseMallDirectory } from '../src/lib/mall-directory';
import { malls, mallCountsByRegion, isSample } from '../src/lib/catalog';

const directory = parseMallDirectory(source);
assert.equal(directory.length, 93);
assert.equal(new Set(directory.map(mall => mall.id)).size, 93);
assert.equal(directory.filter(mall => mall.collection_status === 'error').length, 1);
assert.equal(directory.filter(mall => mall.collection_status === 'unscraped').length, 92);
assert.equal(directory.find(mall => mall.name === '남도장터')?.region, 'jeonnam');
assert.equal(directory.find(mall => mall.name === '남도장터')?.url, 'https://www.jnmall.kr/');
assert.equal(malls.length, directory.length);
assert.equal(Object.values(mallCountsByRegion).reduce((a, b) => a + b, 0), 93);
assert(malls.every(mall => !mall.url.includes('example.com')));
if (isSample) assert(malls.every(mall => mall.product_count === 0));
for (const change of [
  (list: any[]) => { list.push(list[0]); },
  (list: any[]) => { list[0].url = 'javascript:alert(1)'; },
  (list: any[]) => { list[0].region = '알수없음'; },
  (list: any[]) => { list[0].status = 'active'; },
  (list: any[]) => { list[0].url = list[1].url; },
]) { const copy = structuredClone(source); change(copy); assert.throws(() => parseMallDirectory(copy)); }
console.log('쇼핑몰 93개 변환·지역 매핑·URL·상태·샘플 분리 검증 통과');
