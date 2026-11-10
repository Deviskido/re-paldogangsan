import { Suspense } from 'react';
import ProductExplorer from '@/components/products/ProductExplorer';
export default function Page() { return <Suspense fallback={<p className="p-12" role="status">상품을 준비하고 있습니다…</p>}><ProductExplorer title="카테고리별 상품" /></Suspense>; }
