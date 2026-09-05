import { useEffect, useState } from "react";
import { History, Truck, Zap } from "lucide-react";

function Badges({ p }) {
  if (!p.isRocket && !p.isFreeShipping) return null;
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
      {p.isRocket && (
        <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 9, color: "#2F6F4E", background: "#E7F0EA", padding: "2px 5px", borderRadius: 3, fontWeight: 500 }}>
          <Zap size={9} /> 로켓
        </span>
      )}
      {p.isFreeShipping && (
        <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 9, color: "#4A524F", background: "#EEF1EF", padding: "2px 5px", borderRadius: 3, fontWeight: 500 }}>
          <Truck size={9} /> 무료배송
        </span>
      )}
    </div>
  );
}

// 이미지/이름을 누르면 바로 이동 - 별도 구매 버튼 없이 카드 전체가 링크
function ProductTile({ p, onView }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onView(p)}
      style={{ textDecoration: "none", color: "inherit", border: "1px solid #D4DBD3", borderRadius: 8, background: "#fff", overflow: "hidden", display: "block" }}
    >
      <div style={{ position: "relative", aspectRatio: "1 / 1" }}>
        <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {p.rank <= 3 && (
          <span style={{ position: "absolute", top: 6, left: 6, background: "#2F6F4E", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
            베스트 {p.rank}
          </span>
        )}
      </div>
      <div style={{ padding: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, lineHeight: 1.35, height: 32, overflow: "hidden" }}>{p.name}</p>
        <Badges p={p} />
        <div style={{ fontSize: 14, fontWeight: 700 }}>{Number(p.price).toLocaleString()}원</div>
      </div>
    </a>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GolfCatalogLanding() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    fetch("/api/products?keyword=골프용품")
      .then((res) => res.json())
      .then((json) => {
        if (json.products && json.products.length > 0) {
          setProducts(shuffle(json.products));
          setStatus("ready");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  // 클릭한 상품과 같은 카테고리 상품을 목록 상단으로 끌어올리는 재정렬
  const handleView = (product) => {
    setViewed((prev) => [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 4));
    setProducts((prev) => {
      const sameCategory = prev.filter((p) => p.category === product.category);
      const others = prev.filter((p) => p.category !== product.category);
      return [...sameCategory, ...others];
    });
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "#F2F5EF", minHeight: "100%", color: "#1B2430" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
        .serif { font-family: 'Noto Serif KR', serif; }
      `}</style>

      <div style={{ maxWidth: 430, margin: "0 auto", background: "#F2F5EF" }}>
        <div style={{ borderBottom: "1px solid #D4DBD3", padding: "12px 18px" }}>
          <p style={{ fontSize: 11, color: "#6B7370", marginBottom: 4 }}>
            골프 좋아하시는 분이 클릭해주셨네요, 와주셔서 감사해요 🙂
          </p>
          <p style={{ fontSize: 10, color: "#8A9490" }}>
            이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>

        <div style={{ padding: "24px 18px 4px" }}>
          <h1 className="serif" style={{ fontSize: 21, lineHeight: 1.5, margin: "0 0 8px" }}>
            지금 골퍼들이 가장 많이 찾는 것들, 한눈에 보고 가세요
          </h1>
          <p style={{ fontSize: 13, color: "#4A524F" }}>
            실시간 검색순위 기준이라 지금 눌러보시는 게 제일 빨라요
          </p>
        </div>

        {status === "loading" && (
          <p style={{ padding: "24px 18px", fontSize: 13, color: "#8A9490" }}>상품을 불러오는 중이에요...</p>
        )}
        {status === "error" && (
          <p style={{ padding: "24px 18px", fontSize: 13, color: "#8A9490" }}>
            상품을 불러오지 못했어요. 잠시 후 새로고침 해주세요.
          </p>
        )}

        {status === "ready" && (
          <div style={{ padding: "20px 18px 4px" }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#4A524F", marginBottom: 10 }}>골프템 모음</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {products.map((p) => (
                <ProductTile key={p.id} p={p} onView={handleView} />
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "24px 18px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <History size={13} color="#6B7370" />
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#4A524F" }}>방금 살펴보신 상품</h2>
          </div>
          {viewed.length === 0 ? (
            <p style={{ fontSize: 12, color: "#8A9490" }}>상품을 눌러보시면 여기에 기록되고, 같은 종류의 상품이 위로 올라와요</p>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {viewed.map((p) => (
                <div key={p.id} style={{ border: "1px solid #D4DBD3", borderRadius: 4, padding: "8px 11px", fontSize: 11, background: "#fff" }}>
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "20px 18px 36px" }}>
          <p style={{ fontSize: 10, color: "#8A9490" }}>
            이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
