'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/types';
import { REGION_NAMES } from '@/src/types/mall';
import { isSample, safeExternalUrl } from '@/src/lib/catalog';
export default function ProductCard({ product, onClick }: { product: Product; onClick?: (product: Product) => void }) {
  const [failed, setFailed] = useState(false);
  const href = safeExternalUrl(product.product_url);
  return <article className="bg-white border rounded-2xl overflow-hidden shadow-sm">
    <div className="relative h-48 bg-stone-100"><Image src={failed ? '/images/placeholder-product.svg' : product.image_url} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" onError={() => setFailed(true)} /></div>
    <div className="p-5"><p className="text-xs text-emerald-800 mb-2">{REGION_NAMES[product.mall_region as keyof typeof REGION_NAMES]}</p><h3 className="font-bold text-lg">{product.name}</h3><p className="text-sm text-gray-500 mt-1">{product.mall_name}</p>
    <div className="flex flex-wrap gap-2 my-4">{product.categories.map(category => <Link key={category} href={'/category/' + encodeURIComponent(category)} className="text-xs bg-stone-100 rounded-full px-3 py-1">{category}</Link>)}</div>
    <p className="text-xl font-bold mb-4">{product.price.toLocaleString('ko-KR')}원</p>
    {isSample ? <p className="text-sm text-gray-500">샘플 상품 · 구매 연결 준비 중</p> : href ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline" onClick={onClick ? event => { event.preventDefault(); onClick(product); } : undefined}>판매처에서 보기 ↗</a> : <p>판매처 주소 확인 중</p>}
    </div></article>;
}
