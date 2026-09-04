import { useEffect, useState } from "react";
import { ArrowUpRight, History, Truck, Zap } from "lucide-react";

function Badges({ p }) {
  if (!p.isRocket && !p.isFreeShipping) return null;
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
      {p.isRocket && (
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#2F6F4E", background: "#E7F0EA", padding: "3px 7px", borderRadius: 4, fontWeight: 500 }}>
          <Zap size={10} /> 로켓배송
        </span>
      )}
      {p.isFreeShipping && (
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#4A524F", background: "#EEF1EF", padding: "3px 7px", borderRadius: 4, fontWeight: 500 }}>
          <Truck size={10} /> 무료배송
        </span>
      )}
    </div>
  );
}

function ProductCard({ p, badge, onView }) {
  return (
    <div style={{ border: "1px solid #D4DBD3", borderRadius: 8, background: "#fff", overflow: "hidden", marginBottom: 14 }}>
      <div style={{ position: "relative" }}>
        <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
        {badge && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "#2F6F4E", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>{p.name}</p>
        <Badges p={p} />
        <p style={{ fontSize: 11, color: "#8A9490", marginBottom: 8 }}>쿠팡 검색 순위 {p.rank}위</p>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
          {Number(p.price).toLocaleString()}원
        </div>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onView(p)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: "100%",
            padding: "11px",
            borderRadius: 6,
            border: "none",
            background: "#2F6F4E",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          구매하러 가기 <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
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

  const bestProducts = [...products].sort((a, b) => a.rank - b.rank).slice(0, 3);

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
          <>
            <div style={{ padding: "20px 18px 4px" }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#4A524F", marginBottom: 10 }}>지금 검색 상위권 베스트</h2>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {bestProducts.map((p, i) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleView(p)}
                    style={{ minWidth: 120, textDecoration: "none", color: "inherit", border: "1px solid #D4DBD3", borderRadius: 6, overflow: "hidden", background: "#fff" }}
                  >
                    <div style={{ position: "relative" }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
                      <span style={{ position: "absolute", top: 6, left: 6, background: "#2F6F4E", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999 }}>
                        {i + 1}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, padding: "8px 8px 10px", lineHeight: 1.3 }}>{p.name}</p>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ padding: "20px 18px 4px" }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#4A524F", marginBottom: 10 }}>골프템 모음</h2>
              {products.map((p) => (
                <ProductCard key={p.id} p={p} onView={handleView} />
              ))}
            </div>
          </>
        )}

        <div style={{ padding: "8px 18px 4px" }}>
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
