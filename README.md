# 골프 랜딩페이지 프로토타입

## 로컬에서 확인하기
```
npm install
npm run dev
```

## Vercel로 배포하기
1. 이 폴더 전체를 새 GitHub 저장소에 올리기 (예: golf-landing)
2. vercel.com 접속 → "Continue with GitHub"로 로그인
3. "Add New... > Project" → 방금 만든 저장소 선택 → Import
4. Framework Preset이 자동으로 "Vite"로 잡히면 그대로 Deploy 클릭
5. 1~2분 뒤 https://golf-landing-xxxx.vercel.app 같은 주소가 생성됨

## 상품 데이터 수정
`src/App.jsx` 안의 `PRODUCTS` 배열을 직접 수정하면 됩니다.
