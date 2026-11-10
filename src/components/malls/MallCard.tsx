import type { DirectoryMall } from '@/lib/mall-directory';
import { REGION_NAMES } from '@/types/mall';
import { safeExternalUrl } from '@/lib/catalog';
export default function MallCard({ mall }: { mall: DirectoryMall }) {
  const href = safeExternalUrl(mall.url);
  return <article className="rounded-2xl border bg-white dark:bg-slate-900 p-6 flex flex-col gap-4">
    <p className="text-sm text-emerald-800 dark:text-emerald-300">{REGION_NAMES[mall.region]}</p>
    <h2 className="text-xl font-bold">{mall.name}</h2>
    <p className="text-sm text-gray-600 dark:text-slate-300">{mall.collection_status === 'error' ? '수집 오류 기록 있음' : '상품 미수집'}</p>
    <p className="text-sm">{mall.product_count > 0 ? '연결된 상품 ' + mall.product_count + '개' : '아직 연결된 상품 정보가 없습니다.'}</p>
    <p className="text-sm text-gray-500 dark:text-slate-400 break-all">{mall.url}</p>
    {href && <a href={href} target="_blank" rel="noopener noreferrer" className="mt-auto block rounded-lg bg-emerald-900 text-white text-center p-3">쇼핑몰 방문하기 ↗</a>}
  </article>;
}
