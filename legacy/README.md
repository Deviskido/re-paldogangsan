# 이전 구현 보관

현재 앱에서 사용하지 않는 파일을 삭제하지 않고 이곳으로 이동했습니다. 기능을 다시 채택하기 전에 현재 명세와 데이터 계약에 맞춰 검토하세요. 이 디렉터리는 빌드·배포 대상이 아닙니다.

- `components`: Hero, SearchBar, SearchResults, TagCloud, OptimizedImage, FAQAccordion
- `hooks`: 이전 Fuse 기반 검색 훅
- `lib`: 이전 검색·CDN·지역 데이터 로딩·검증 로직
- `fixtures`: 이전 상품·몰·인덱스 JSON 예시
- `tests`: 이전 검증 실행 예제
- `pages/tailwind-demo.tsx`: 서비스 경로에서 분리한 `/test` 화면
- `types`: 이전 지도 라이브러리 타입 선언
- `config`: 미사용 production 설정 별칭

현재 기능은 `src/`, 유지보수 도구는 `scripts/`와 `tools/`에 있습니다. 이전 파일 경로는 [이동 목록](../docs/file-moves.json)에서 찾을 수 있습니다.
