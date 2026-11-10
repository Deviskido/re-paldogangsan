'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { products, malls, mallCountsByRegion, categories, categoryCounts, isSample, updatedAt } from '@/lib/catalog';
import Link from 'next/link';
import { discover } from '@/lib/discovery';
import { REGION_NAMES } from '@/types/mall';
import ProductGrid from './ProductGrid';
import KoreaMap from '../maps/KoreaMap';

export default function ProductExplorer({ home = false, title = '상품 찾기' }: { home?: boolean; title?: string }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || '');
  const router = useRouter();
  const pathname = usePathname() || '/';
  const query = params.get('q') || '';
  const region = params.get('region') || '';
  const selected = params.getAll('category');
  const mode = params.get('mode') === 'AND' ? 'AND' : 'OR';
  const sort = params.get('sort') || 'relevance';
  const results = discover(products, { q: query, region, categories: selected, mode, sort });
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.push(`${pathname}?${next}`, { scroll: false });
  }
  function toggle(category: string) {
    const next = new URLSearchParams(params.toString());
    next.delete('category');
    (selected.includes(category) ? selected.filter(item => item !== category) : [...selected, category]).forEach(item => next.append('category', item));
    router.push(`${pathname}?${next}`, { scroll: false });
  }
  return <div className="bg-stone-50 dark:bg-slate-950 min-h-screen">
    <header className="bg-emerald-950 text-white px-5 py-14">
      <div className="max-w-6xl mx-auto">
        <p className="text-emerald-200 mb-4 tracking-widest text-sm">PALDOGANGSAN · 우리 지역의 발견</p>
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{home ? <>팔도의 좋은 것들을,<br />한 곳에서 만나보세요.</> : title}</h1>
        <p className="mt-5 text-emerald-100">지역 쇼핑몰의 상품을 찾고, 마음에 드는 판매처를 발견하세요.</p>
        <p className="mt-6 text-sm">쇼핑몰 주소 {malls.length}개 · {isSample ? '샘플 ' : ''}상품 {products.length}개 · 전국 17개 시·도 탐색</p>
        <Link href="/malls" className="inline-block mt-4 underline">실제 쇼핑몰 둘러보기 →</Link>
      </div>
    </header>
    <div className="max-w-6xl mx-auto px-5 py-8">
      <p className="rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 text-sm mb-6">{isSample ? '상품과 가격은 샘플이며 실제 쇼핑몰과 연결되지 않습니다. 쇼핑몰 목록에서는 기존에 정리된 실제 주소로 방문할 수 있습니다.' : '구매 전 판매처에서 최신 가격과 재고를 확인해 주세요.'} <span className="block mt-1">{isSample ? '샘플 상품' : '상품 데이터'} 기준: {updatedAt.slice(0, 10)}</span></p>
      <label className="block font-semibold mb-2" htmlFor="product-query">상품 검색</label>
      <input id="product-query" type="search" value={query} onChange={event => update('q', event.target.value)} placeholder="상품, 쇼핑몰, 지역, 카테고리 · 초성 검색도 가능해요" className="w-full p-4 rounded-xl border bg-white dark:bg-slate-900" />
      <section className="mt-8" aria-labelledby="region-heading">
        <h2 id="region-heading" className="font-semibold mb-3">어느 지역을 둘러볼까요?</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">상품의 원산지가 아닌 쇼핑몰 소재지 기준입니다.</p>
        {home && <KoreaMap
          selectedRegion={region}
          mallCounts={mallCountsByRegion}
          productCounts={Object.fromEntries(Object.keys(REGION_NAMES).map(code => [code, products.filter(product => product.mall_region === code).length]))}
          onRegionClick={code => update('region', region === code ? '' : code)}
        />}
        <div className="flex flex-wrap gap-2">
          <button className="filter-chip" aria-pressed={!region} onClick={() => update('region', '')}>전국 · {home ? `쇼핑몰 ${malls.length}` : `상품 ${products.length}`}</button>
          {Object.entries(REGION_NAMES).map(([code, name]) => <button key={code} className="filter-chip" aria-pressed={region === code} onClick={() => update('region', region === code ? '' : code)}>{name} <span className="opacity-60">{home ? `쇼핑몰 ${mallCountsByRegion[code] || 0}` : `상품 ${products.filter(product => product.mall_region === code).length}`}</span></button>)}
        </div>
        <Link href={region ? `/malls?region=${encodeURIComponent(region)}` : '/malls'} className="inline-block mt-4 text-emerald-800 dark:text-emerald-300 underline">
          {region ? `이 지역 쇼핑몰 ${mallCountsByRegion[region] || 0}개 보기` : `전국 쇼핑몰 ${malls.length}개 보기`} →
        </Link>
      </section>
      <section className="mt-7" aria-labelledby="category-heading">
        <h2 id="category-heading" className="font-semibold mb-3">어떤 상품을 찾으세요?</h2>
        <div className="flex flex-wrap gap-2">{categories.map(category => <button key={category} className="filter-chip" aria-pressed={selected.includes(category)} onClick={() => toggle(category)}>{category} {categoryCounts[category]}</button>)}</div>
      </section>
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <label>선택 카테고리 <select className="border rounded-lg p-2 bg-white dark:bg-slate-900" value={mode} onChange={event => update('mode', event.target.value)}><option value="OR">하나라도 포함</option><option value="AND">모두 포함</option></select></label>
        <label>정렬 <select className="border rounded-lg p-2 bg-white dark:bg-slate-900" value={sort} onChange={event => update('sort', event.target.value)}><option value="relevance">기본순</option><option value="price-asc">낮은 가격순</option><option value="price-desc">높은 가격순</option><option value="newest">최신순</option></select></label>
        <button className="underline text-sm" onClick={() => router.push(pathname, { scroll: false })}>조건 초기화</button>
      </div>
      <div aria-live="polite"><ProductGrid key={params.toString()} products={results} title="찾은 상품" /></div>
    </div>
  </div>;
}
