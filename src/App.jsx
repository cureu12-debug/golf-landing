import { useState } from "react";
import { Star, ArrowUpRight, History, Camera, ShoppingBag } from "lucide-react";

const HEADLINE_HOOK = "그립 미끄러워서 스코어 망친 적 있어요";

const PRODUCTS = [
  {
    id: "g1",
    name: "논슬립 골프 장갑 (좌/우 택1)",
    price: "12,900원",
    original: "18,900원",
    discount: "32%",
    rating: 4.8,
    reviews: 2140,
    commentType: "experience",
    comment: "3개월째 쓰는 중인데 습한 날에도 그립감이 그대로예요",
  },
  {
    id: "g2",
    name: "3단 우산형 골프 양산 UPF50+",
    price: "24,500원",
    original: "31,000원",
    discount: "21%",
    rating: 4.7,
    reviews: 986,
    commentType: "summary",
    comment: "그늘 크기, 가벼운 무게",
  },
  {
    id: "g3",
    name: "카본 샤프트 드라이버 헤드커버 세트",
    price: "38,900원",
    original: "45,000원",
    discount: "14%",
    rating: 4.6,
    reviews: 512,
    commentType: "summary",
    comment: "소음 감소, 마감 품질",
  },
  {
    id: "g4",
    name: "거리측정기 방수 파우치",
    price: "9,800원",
    original: "12,900원",
    discount: "24%",
    rating: 4.9,
    reviews: 341,
    commentType: "summary",
    comment: "부착력, 방수 성능",
  },
];

export default function GolfLandingConversion() {
  const [viewed, setViewed] = useState([]);
  const primary = PRODUCTS[0];

  const handleView = (product) => {
    setViewed((prev) => [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 3));
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "#F2F5EF", minHeight: "100%", color: "#1B2430", paddingBottom: 72 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
        .serif { font-family: 'Noto Serif KR', serif; }
      `}</style>

      {/* 유입 문구 미리보기 */}
      <div style={{ borderBottom: "1px solid #D4DBD3", padding: "14px 24px" }}>
        <p style={{ maxWidth: 720, margin: "0 auto", fontSize: 12, color: "#6B7370" }}>
          SNS에서 보고 오신 문구 — <span style={{ color: "#2F6F4E", fontWeight: 500 }}>"{HEADLINE_HOOK}"</span>
        </p>
      </div>

      {/* 히어로: 헤드라인 그대로 이어받기 */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 12px" }}>
        <h1 className="serif" style={{ fontSize: 26, lineHeight: 1.5, margin: "0 0 10px" }}>
          그 그립 미끄러짐, 장갑 하나 바꾸고 사라졌어요
        </h1>
        <p style={{ fontSize: 14, color: "#4A524F", marginBottom: 24 }}>
          3개월째 쓰는 중인데, 습한 날에도 그립감이 그대로예요
        </p>

        {/* 대표 상품 카드 - 실사용 사진 자리 + 신뢰 요소 강조 */}
        <div style={{ border: "1.5px solid #2F6F4E", borderRadius: 6, background: "#fff", overflow: "hidden" }}>
          <div
            style={{
              height: 140,
              background: "#E7F0EA",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "#5F8B72",
            }}
          >
            <Camera size={22} />
            <span style={{ fontSize: 11 }}>실사용 사진 자리 (스톡 이미지 아님)</span>
          </div>
          <div style={{ padding: 18 }}>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{primary.name}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Star size={13} color="#C98A2C" fill="#C98A2C" />
              <span style={{ fontSize: 12, color: "#4A524F" }}>{primary.rating}</span>
              <span style={{ fontSize: 12, color: "#8A9490" }}>· 리뷰 {primary.reviews.toLocaleString()}개</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1B2430" }}>{primary.price}</span>
              <span style={{ fontSize: 13, color: "#B5BCB8", textDecoration: "line-through" }}>{primary.original}</span>
              <span style={{ fontSize: 12, color: "#C98A2C", fontWeight: 500 }}>{primary.discount} 할인</span>
            </div>
            <div style={{ marginBottom: 14, background: "#F7F5EF", padding: "10px 12px", borderRadius: 4 }}>
              <p style={{ fontSize: 10, color: "#5F8B72", fontWeight: 500, marginBottom: 4 }}>직접 써본 후기</p>
              <p style={{ fontSize: 13, color: "#4A524F", lineHeight: 1.5 }}>"{primary.comment}"</p>
            </div>
            <button
              onClick={() => handleView(primary)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 4,
                border: "none",
                background: "#2F6F4E",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              지금 보러가기 <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 함께 보면 좋은 상품 */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 8px" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#4A524F", marginBottom: 14 }}>함께 보면 좋은 상품</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {PRODUCTS.slice(1).map((p) => (
            <button
              key={p.id}
              onClick={() => handleView(p)}
              style={{ textAlign: "left", border: "1px solid #D4DBD3", borderRadius: 4, padding: 14, background: "#fff", cursor: "pointer" }}
            >
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                <Star size={11} color="#C98A2C" fill="#C98A2C" />
                <span style={{ fontSize: 11, color: "#8A9490" }}>{p.rating} · 리뷰 {p.reviews.toLocaleString()}개</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{p.price}</span>
                <span style={{ fontSize: 11, color: "#B5BCB8", textDecoration: "line-through" }}>{p.original}</span>
              </div>
              <p style={{ fontSize: 10, color: "#8A9490", marginBottom: 2 }}>구매자 리뷰 요약</p>
              <p style={{ fontSize: 11, color: "#4A524F", lineHeight: 1.4 }}>{p.comment}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 방금 살펴본 상품 */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <History size={14} color="#6B7370" />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#4A524F" }}>방금 살펴보신 상품</h2>
        </div>
        {viewed.length === 0 ? (
          <p style={{ fontSize: 13, color: "#8A9490" }}>상품 카드를 눌러보시면 여기에 기록돼요</p>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {viewed.map((p) => (
              <div key={p.id} style={{ border: "1px solid #D4DBD3", borderRadius: 4, padding: "9px 13px", fontSize: 12, background: "#fff" }}>
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 이탈 직전 마지막 리마인드 */}
      {viewed.length > 0 && (
        <div style={{ maxWidth: 720, margin: "24px auto 0", padding: "0 24px" }}>
          <div style={{ border: "1px dashed #2F6F4E", borderRadius: 6, padding: "14px 16px", background: "#E7F0EA", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontSize: 13, color: "#2F6F4E" }}>이 상품, 다시 볼까요? — {viewed[0].name}</p>
            <ShoppingBag size={16} color="#2F6F4E" />
          </div>
        </div>
      )}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 0" }}>
        <p style={{ fontSize: 11, color: "#8A9490" }}>
          이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
        </p>
      </div>

      {/* 모바일 하단 고정 CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px",
          background: "#fff",
          borderTop: "1px solid #D4DBD3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: "#8A9490" }}>{primary.name}</p>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{primary.price}</p>
        </div>
        <button
          onClick={() => handleView(primary)}
          style={{ padding: "10px 20px", borderRadius: 4, border: "none", background: "#2F6F4E", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          구매하러 가기
        </button>
      </div>
    </div>
  );
}
