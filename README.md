# 골프 랜딩페이지 (쿠팡파트너스 API 연동)

## 로컬에서 확인하기
```
npm install
npm run dev
```
(로컬에서 API 응답을 보려면 `.env` 파일에 아래 두 값을 넣고 `vercel dev`로 실행해야 합니다.)

## Vercel 배포 + 환경변수 설정 (필수)
1. 이 폴더 전체를 GitHub 저장소에 반영
2. vercel.com → 해당 프로젝트 → Settings → Environment Variables
3. 아래 두 개를 추가:
   - `COUPANG_ACCESS_KEY` = 발급받은 Access Key
   - `COUPANG_SECRET_KEY` = 발급받은 Secret Key
4. 저장 후 Deployments 탭에서 "Redeploy" 실행 (환경변수는 재배포해야 반영됨)

⚠️ Access Key / Secret Key는 절대 코드에 직접 적거나 GitHub에 커밋하지 마세요.
반드시 Vercel 환경변수로만 등록하세요. 이 저장소는 Public이라 코드에 노출되면
누구나 가져다 쓸 수 있습니다.

## 구조
- `src/App.jsx`: 화면 (상품 목록을 /api/products에서 받아와 렌더링)
- `api/products.js`: 쿠팡파트너스 검색 API를 서버에서 대신 호출하는 서버리스 함수
  (HMAC 서명 생성 포함, 10분 캐시)

## 검색 키워드 바꾸기
`src/App.jsx`의 `fetch("/api/products?keyword=골프용품")` 부분의 keyword 값을 바꾸면 됩니다.
