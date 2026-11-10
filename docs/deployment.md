# 정적 배포

1. npm ci로 설치합니다.
2. npm test, npm run typecheck, npm run lint로 검사합니다.
3. npm run build로 out/를 생성합니다.
4. 디렉터리별 index.html을 제공하는 정적 호스팅에 out/ 전체를 올립니다.

Vercel 설정은 vercel.json에 있습니다. build:production은 기본 설정을 덮어쓰지 않습니다.

카탈로그 갱신 후에는 다시 빌드해야 합니다. 실시간 수집과 문의 서버는 포함되지 않습니다. 이번 작업에서는 외부 배포를 수행하지 않았습니다.
