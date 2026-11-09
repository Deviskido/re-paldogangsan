import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateCatalog } from '../src/lib/catalog-validation';

try {
  const source = process.argv[2];
  if (!source) throw new Error('사용법: npm run data:import -- <카탈로그.json>');
  const catalog = validateCatalog(JSON.parse(readFileSync(resolve(source), 'utf8').replace(/^\uFEFF/, '')));
  const target = resolve('data/catalog.json');
  writeFileSync(target + '.tmp', JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  renameSync(target + '.tmp', target);
  console.log(`카탈로그 반영: 상품 ${catalog.products.length}개, 쇼핑몰 ${catalog.malls.length}개. 다시 빌드해 주세요.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
