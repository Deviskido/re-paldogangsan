# 현재 데이터

## malls.json
실제 쇼핑몰 주소 목록입니다. 원본은 [기존 저장소의 .taskmaster/docs/malls.json](https://github.com/devskido/re-paldogangsan/blob/master/.taskmaster/docs/malls.json)이며, 폴더 정리 과정에서 내용 변경 없이 이동했습니다. 앞으로 이 파일을 수정합니다. ID·영문 식별자·이름·주소·한글 지역·과거 수집 상태를 포함하며 `src/lib/mall-directory.ts`가 검증하고 변환합니다.

`unscraped`와 `error`는 수집 기록이며 영업 상태가 아닙니다. 현재 URL 접속 여부를 보증하지 않습니다.

## catalog.json
상품 카탈로그와 그 상품이 참조하는 몰 정보를 담습니다. `mode: sample` 데이터는 실제 쇼핑몰 주소 목록과 분리됩니다. 갱신은 프로젝트 루트에서 실행합니다.

```sh
npm run data:import -- path/to/catalog.json
```

live 상품을 실제 몰에 연결할 때 카탈로그 몰의 `id`는 `directory-원본숫자ID`로 지정하거나 `engname`을 목록과 일치시키세요. 정적 배포에는 데이터 변경 후 재빌드가 필요합니다.

과거 JSON 예시는 `legacy/fixtures`에 있습니다. 수집기 원시 데이터와 생성 결과는 수집기 구현 시 이 디렉터리의 별도 하위 폴더로 저장하며, 현재 화면은 자동으로 읽지 않습니다.
