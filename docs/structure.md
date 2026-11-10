# 프로젝트 폴더 구조

## 분류 원칙
애플리케이션 실행 코드는 `src`, 현재 입력 데이터는 `data`, 실행 명령은 `scripts`, 수집 도구는 `tools`, 검증 코드는 `tests`, 문서는 `docs`에 둔다. 현재 앱에서 참조하지 않는 과거 구현은 `legacy`에 보존한다. 폴더 이름은 소문자·하이픈, React 컴포넌트는 PascalCase를 사용한다.

```text
paldogangsan/
├── src/
│   ├── app/                    # Next.js 페이지와 루트 레이아웃
│   │   ├── about/              # 소개
│   │   ├── categories/         # 복합 카테고리 탐색
│   │   ├── category/[slug]/    # 카테고리 상세
│   │   ├── contact/            # 문의 안내
│   │   ├── malls/              # 실제 쇼핑몰 목록
│   │   └── search/             # 상품 검색
│   ├── components/
│   │   ├── layout/             # Navigation, Footer, ThemeToggle
│   │   ├── products/           # ProductExplorer/Grid/Card, CategoryTag
│   │   ├── malls/              # MallCard
│   │   ├── maps/               # KoreaMap
│   │   └── ui/                 # Pagination 및 공통 UI 확장 위치
│   ├── lib/                    # 카탈로그, 검증, 검색·필터, 공통 유틸
│   ├── types/                  # 상품·쇼핑몰·검색 인덱스 데이터 계약
│   └── styles/globals.css      # 전역 스타일과 테마
├── data/
│   ├── catalog.json            # 상품 카탈로그 (현재 샘플)
│   ├── malls.json              # 실제 쇼핑몰 주소 93개
│   └── README.md               # 데이터 출처와 갱신 방법
├── public/                     # URL로 직접 제공하는 아이콘·대체 이미지
├── scripts/import-catalog.ts   # 현재 카탈로그 가져오기 CLI
├── tools/scrapers/             # 수집기 기반 클래스·예시·파이프라인
├── tests/                      # 현재 검색·데이터 검증 회귀 테스트
├── docs/
│   ├── deployment.md           # 정적 배포 안내
│   ├── structure.md            # 이 문서
│   ├── file-moves.json         # 이전 파일 경로 → 현재 경로 전체 기록
│   └── history/                # 원본 PRD와 과거 확장 계획
├── legacy/                     # 앱에 연결되지 않은 이전 구현
│   ├── components/            # 구 Hero, 검색 UI, 태그 클라우드 등
│   ├── hooks/                 # 이전 Fuse 검색 훅
│   ├── lib/                   # 이전 검색/CDN/지역 로더/검증
│   ├── tests/                 # 과거 검증 예제
│   ├── fixtures/              # 과거 JSON 샘플
│   ├── pages/                 # 이전 /test 스타일 데모
│   ├── types/                 # 이전 지도 라이브러리 선언
│   └── config/                # 불필요해진 production 설정 별칭
├── .cursor/                    # Cursor 전용 규칙·연결 설정
├── .taskmaster/                # Task Master 설정·상태·작업 이력
├── README.md                   # 시작 안내
├── 명세.md                     # 현재 구현 명세 (기존 요청 경로 유지)
└── 설정 파일들                 # 프레임워크/패키지 도구의 루트 설정
```

## 기존 폴더 검토 결과
| 이전 위치 | 판단 및 변경 |
| --- | --- |
| `app/`와 `src/` | 실행 코드의 두 루트를 `src/`로 통일. 페이지 URL은 유지하고 사용하지 않는 `/test`만 보관 처리 |
| `components/` | 하나의 평면 목록을 layout/products/malls/maps/ui로 분류 |
| `lib/`와 `src/lib/` | 공통 유틸을 `src/lib`로 합치고 현재 미사용 로직은 `legacy/lib`로 분리 |
| `styles/` | 실행 코드에 속하므로 `src/styles`로 이동 |
| `src/hooks/` | 유일한 훅이 미사용이므로 `legacy/hooks`로 이동. 빈 폴더는 제거 |
| `data/samples/` | 현재 화면이 직접 쓰지 않는 과거 샘플이므로 `legacy/fixtures`로 이동 |
| `.taskmaster/docs/malls.json` | 도구 문서가 아닌 실행 데이터이므로 `data/malls.json`으로 이동 |
| `.taskmaster/docs/PRD.txt`, `future-plan.txt` | 과거 기획 자료이므로 `docs/history`로 이동 |
| `scrapers/` | 웹 앱 코드가 아닌 별도 수집 도구이므로 `tools/scrapers`로 이동 |
| `scripts/` | 현재 데이터 관리 CLI에 적합하므로 유지 |
| `tests/` | 현재 회귀 검증 위치로 적합하므로 유지 |
| `public/` | Next.js가 루트에서 찾는 정적 자산 위치이므로 유지 |
| `.cursor/`, `.taskmaster/`, `.mcp.json` | 관련 도구가 찾는 위치이므로 유지. 앱이 참조하지 않음 |
| `.git/` | 버전 관리 메타데이터. 변경하지 않음 |
| `.next/`, `out/`, `node_modules/`, `*.tsbuildinfo` | 도구가 생성하는 산출물. 소스 폴더로 이동하지 않으며 Git에서 제외 |

## 경로와 설정
- `@/*`는 `src/*`를 가리킨다. 예: `@/components/layout/Navigation`, `@/lib/catalog`.
- Node CLI, 테스트, 수집기는 런타임 별칭 해석기가 필요 없도록 상대 경로를 쓴다.
- `tsconfig.json`은 앱 소스를 검사한다. `tsconfig.scripts.json`은 CLI·수집기·테스트를 검사한다. `npm run typecheck`가 두 범위를 모두 검사한다.
- `legacy`는 앱 타입 검사와 Tailwind 스캔, 정적 배포 대상에서 제외한다. 현재 앱·CLI가 보관 코드에 의존하지 않도록 한다.
- Tailwind는 `src`만 스캔한다. `components.json`의 CSS와 공통 UI 경로도 새 위치를 사용한다.
- `package.json`, 잠금 파일, Next/PostCSS/Tailwind/TypeScript/ESLint/Vercel 설정, `next-env.d.ts`, 환경변수 파일은 도구 인식과 기존 실행 방식을 위해 루트에 유지한다. 작은 프로젝트에서 이들을 임의의 `config/`로 옮기면 불필요한 경로 설정이 늘어난다.
- `next.config.production.js`는 동일 설정을 다시 내보내는 미사용 별칭이므로 `legacy/config`로 보존한다. 실제 빌드는 `next.config.js` 하나를 사용한다.
- 상세 이동 목록은 [file-moves.json](file-moves.json)에 기록했다. 파일 내용은 import/설정/문서 경로 변경을 제외하고 보존했다.

## 앞으로 파일을 추가할 때
페이지는 `src/app`, 화면 조각은 담당 기능의 `src/components` 하위, 비 UI 순수 로직은 `src/lib`, 도메인 타입은 `src/types`에 둔다. 실행 데이터와 테스트 예시를 섞지 않는다. 새 쇼핑몰은 `data/malls.json`, 상품 갱신은 `npm run data:import`를 사용한다. 수집기를 구현할 때는 `tools/scrapers`의 안내를 참고한다.

## 정리 후 검증 (2026-11-10)
- 이동 기록 52개 모두 새 위치에 존재하며 이전 경로에는 파일이 남아 있지 않음을 확인했다.
- 앱·CLI·수집기·테스트의 로컬 import 66개를 TypeScript 해석기로 확인했고, 현재 코드가 `legacy`에 의존하지 않음을 확인했다.
- 검색·쇼핑몰 회귀 테스트, 앱 및 관리 도구 타입 검사, 린트, 정적 빌드를 통과했다.
- 주요 페이지 6개와 실제 데이터의 한글 카테고리 출력이 존재하며 `/test` 출력은 제거됐음을 확인했다.
- 루트의 빈 `app` 폴더가 `src/app`을 가리지 않도록 이전 빈 폴더도 제거했다.
- 폴더 이동 전부터 실행 중인 개발 서버는 종료한 뒤 `npm run dev`로 다시 실행한다.
