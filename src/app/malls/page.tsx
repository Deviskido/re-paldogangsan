'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MallCard from '@/components/malls/MallCard';
import { malls } from '@/lib/catalog';
import { REGION_NAMES } from '@/types/mall';
import { normalize } from '@/lib/discovery';

function MallDirectory() {
  const params = useSearchParams();
  const router = useRouter();
  const region = params?.get('region') || '';
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('name');
  const filtered = malls.filter(mall => (!region || mall.region === region) &&
    (status === 'all' || mall.collection_status === status) &&
    normalize([mall.name, mall.engname, mall.url, REGION_NAMES[mall.region]].join(' ')).includes(normalize(query)))
    .sort((a, b) => sort === 'products' ? b.product_count - a.product_count || a.name.localeCompare(b.name, 'ko') : a.name.localeCompare(b.name, 'ko'));
  function selectRegion(value: string) {
    const next = new URLSearchParams(params?.toString());
    if (value) next.set('region', value); else next.delete('region');
    router.push('/malls?' + next.toString(), { scroll: false });
  }
  return <div className="bg-stone-50 dark:bg-slate-950 min-h-screen"><div className="max-w-6xl mx-auto px-5 py-12">
    <h1 className="text-3xl font-bold">지역 쇼핑몰 둘러보기</h1>
    <p className="mt-3 text-gray-600 dark:text-slate-300">등록된 쇼핑몰 {malls.length}개 · {new Set(malls.map(mall => mall.region)).size}개 시·도</p>
    <p className="mt-5 rounded-xl border bg-white dark:bg-slate-900 p-4 text-sm text-gray-600 dark:text-slate-300">기존 프로젝트에 정리된 쇼핑몰 주소 목록입니다. 상품 수집 상태는 과거 기록이며 현재 영업 여부나 접속 가능 여부를 뜻하지 않습니다. 최신 운영 상태는 각 쇼핑몰에서 확인해 주세요.</p>
    <div className="mt-6 flex flex-wrap gap-4 items-end">
      <label className="flex-1 min-w-48">쇼핑몰 검색<input className="mt-2 block w-full border rounded-lg p-3" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="이름, 지역, 주소 검색" /></label>
      <label>지역<select className="mt-2 block border rounded-lg p-3" value={region} onChange={event => selectRegion(event.target.value)}><option value="">전국</option>{Object.entries(REGION_NAMES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
      <label>수집 상태<select className="mt-2 block border rounded-lg p-3" value={status} onChange={event => setStatus(event.target.value)}><option value="all">전체</option><option value="unscraped">상품 미수집</option><option value="error">수집 오류 기록</option></select></label>
      <label>정렬<select className="mt-2 block border rounded-lg p-3" value={sort} onChange={event => setSort(event.target.value)}><option value="name">이름순</option><option value="products">연결 상품 많은 순</option></select></label>
      <button className="underline p-3" onClick={() => { setQuery(''); setStatus('all'); setSort('name'); selectRegion(''); }}>초기화</button>
    </div>
    <p className="my-6" aria-live="polite">검색된 쇼핑몰 {filtered.length}개</p>
    {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(mall => <MallCard key={mall.id} mall={mall} />)}</div> : <p className="py-12 text-center">해당 조건의 쇼핑몰이 없습니다. 다른 지역이나 검색어를 선택해 주세요.</p>}
    <p className="mt-8 text-sm text-gray-500 dark:text-slate-400">자료 출처: <a className="underline" href="https://github.com/devskido/re-paldogangsan/blob/master/.taskmaster/docs/malls.json" target="_blank" rel="noopener noreferrer">프로젝트 쇼핑몰 목록</a></p>
  </div></div>;
}
export default function MallsPage() { return <Suspense fallback={<p className="p-12" role="status">쇼핑몰 목록을 준비하고 있습니다…</p>}><MallDirectory /></Suspense>; }
