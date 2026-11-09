'use client';
import { REGION_NAMES } from '@/src/types/mall';
export default function KoreaMap({ onRegionClick, productCounts = {}, selectedRegion }: { onRegionClick?: (region: string) => void; productCounts?: Record<string, number>; selectedRegion?: string }) { return <div aria-label="지역 선택" className="flex flex-wrap gap-2">{Object.entries(REGION_NAMES).map(([code, name]) => <button className="filter-chip" key={code} aria-pressed={selectedRegion === code} onClick={() => onRegionClick?.(code)}>{name} {productCounts[code] || 0}</button>)}</div>; }
