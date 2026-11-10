import { REGION_NAMES, type Region } from '../types/mall';

export interface DirectoryMall {
  id: string;
  source_id: number;
  name: string;
  engname: string;
  url: string;
  region: Region;
  collection_status: 'unscraped' | 'error';
  product_count: number;
}

const regions: Record<string, Region> = {
  서울: 'seoul', 부산: 'busan', 대구: 'daegu', 인천: 'incheon', 광주: 'gwangju',
  대전: 'daejeon', 울산: 'ulsan', 세종: 'sejong', 경기: 'gyeonggi', 강원: 'gangwon',
  충북: 'chungbuk', 충남: 'chungnam', 전북: 'jeonbuk', 전남: 'jeonnam',
  경북: 'gyeongbuk', 경남: 'gyeongnam', 제주: 'jeju',
};

// Directory status describes historical collection attempts, not whether a shop is open.
export function parseMallDirectory(input: unknown): DirectoryMall[] {
  if (!Array.isArray(input)) throw new Error('쇼핑몰 목록은 배열이어야 합니다');
  const ids = new Set<number>();
  const slugs = new Set<string>();
  const urls = new Set<string>();
  return input.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`쇼핑몰 ${index}: 객체가 필요합니다`);
    const entry = item as Record<string, unknown>;
    if (!Number.isInteger(entry.id) || (entry.id as number) < 1 || ids.has(entry.id as number)) throw new Error(`쇼핑몰 ${index}: ID 오류/중복`);
    for (const field of ['name', 'engname', 'url', 'region']) {
      if (typeof entry[field] !== 'string' || !(entry[field] as string).trim()) throw new Error(`쇼핑몰 ${index}: ${field} 오류`);
    }
    const region = regions[entry.region as string];
    if (!region || !Object.hasOwn(REGION_NAMES, region)) throw new Error(`쇼핑몰 ${index}: 알 수 없는 지역`);
    if (!['unscraped', 'error'].includes(entry.status as string)) throw new Error(`쇼핑몰 ${index}: 알 수 없는 수집 상태`);
    const url = new URL(entry.url as string);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(`쇼핑몰 ${index}: 안전하지 않은 URL`);
    if (slugs.has(entry.engname as string) || urls.has(url.href)) throw new Error(`쇼핑몰 ${index}: 중복 식별자/URL`);
    ids.add(entry.id as number); slugs.add(entry.engname as string); urls.add(url.href);
    return {
      id: `directory-${entry.id}`, source_id: entry.id as number,
      name: entry.name as string, engname: entry.engname as string,
      url: entry.url as string, region,
      collection_status: entry.status as DirectoryMall['collection_status'], product_count: 0,
    };
  });
}
