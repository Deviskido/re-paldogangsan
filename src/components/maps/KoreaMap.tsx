'use client';

import { useState } from 'react';
import mapData from 'react-simple-south-korea-map-chart/dist/mapData';
import { REGION_NAMES } from '@/types/mall';

interface KoreaMapProps {
  onRegionClick?: (region: string) => void;
  productCounts?: Record<string, number>;
  mallCounts?: Record<string, number>;
  selectedRegion?: string;
}

export default function KoreaMap({ onRegionClick, productCounts = {}, mallCounts, selectedRegion }: KoreaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string>();
  const entries = Object.entries(REGION_NAMES);
  const activeRegion = hoveredRegion || selectedRegion;
  const activeName = entries.find(([code]) => code === activeRegion)?.[1];
  const counts = mallCounts ?? productCounts;
  const unit = mallCounts ? '쇼핑몰' : '상품';

  return <div className="mb-5 rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6">
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
      <svg viewBox={mapData.viewBox} role="group" aria-label="대한민국 지도에서 지역 선택" className="korea-map mx-auto w-full max-w-md" style={{ maxHeight: 520 }}>
        {mapData.locations.map(location => {
          const region = entries.find(([, name]) => name === location.name)?.[0];
          if (!region) return null;
          const count = counts[region] || 0;
          const selected = selectedRegion === region;
          return <path
            key={region}
            d={location.path}
            role="button"
            tabIndex={0}
            aria-label={`${location.name}, ${unit} ${count}개`}
            aria-pressed={selected}
            fill={selected ? '#065f46' : count > 0 ? '#6ee7b7' : '#f1f5f3'}
            stroke={selected ? '#022c22' : '#94a39b'}
            strokeWidth={selected ? 2.5 : 1}
            strokeLinejoin="round"
            onClick={() => onRegionClick?.(region)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onRegionClick?.(region);
              }
            }}
            onMouseEnter={() => setHoveredRegion(region)}
            onMouseLeave={() => setHoveredRegion(undefined)}
            onFocus={() => setHoveredRegion(region)}
            onBlur={() => setHoveredRegion(undefined)}
          ><title>{location.name} · {unit} {count}개</title></path>;
        })}
      </svg>
      <div>
        <p className="text-sm text-emerald-800 dark:text-emerald-300 mb-2">지도로 둘러보기</p>
        <div aria-live="polite" className="min-h-24">
          <h3 className="text-xl font-bold">{activeName || '궁금한 지역을 선택하세요'}</h3>
          <p className="mt-3 text-gray-600 dark:text-slate-300">{activeRegion ? `등록 ${unit} ${counts[activeRegion] || 0}개` : '지도를 눌러 지역을 선택하세요. 아래 링크에서 지역 쇼핑몰을 볼 수 있습니다.'}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-4">선택한 지역을 다시 누르면 전국 상품을 볼 수 있습니다. 작은 지역은 아래 버튼으로도 선택할 수 있어요.</p>
        <div className="flex flex-wrap gap-3 text-xs mt-6">
          <span><span className="inline-block h-3 w-3 rounded-sm bg-emerald-800 mr-1" />선택 지역</span>
          <span><span className="inline-block h-3 w-3 rounded-sm bg-emerald-300 mr-1" />{unit} 등록</span>
          <span><span className="inline-block h-3 w-3 rounded-sm border bg-stone-100 dark:bg-slate-800 mr-1" />{unit} 미등록</span>
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-400 dark:text-slate-400 mt-3">지도 경계: <a href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/south-korea" target="_blank" rel="noopener noreferrer" className="underline">svg-maps</a> · CC BY 4.0 · 색상 및 상호작용 수정</p>
  </div>;
}
