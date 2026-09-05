import { useEffect, useState } from "react";
import { History, Truck, Zap, Flame } from "lucide-react";

function Badges({ p }) {
  if (!p.isRocket && !p.isFreeShipping) return null;
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
      {p.isRocket && (
        <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 9, color: "#fff", background: "#2563EB", padding: "2px 5px", borderRadius: 3, fontWeight: 700 }}>
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

function ProductTile({ p, onView }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onView(p)}
      className="tile"
      style={{ textDecoration: "none", color: "inherit", border: "1px solid #E2E5E1", borderRadius: 10, background: "#fff", overflow: "hidden", display: "block" }}
    >
      <div style={{ position: "relative", aspectRatio: "1 / 1" }}>
        <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {p.primary && p.rank <= 3 && (
          <span style={{ position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 2, background: "#FF3B30", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 7px", borderRadius: 999 }}>
            <Flame size={10} /> {p.rank}위
          </span>
        )}
      </div>
      <div style={{ padding: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, lineHeight: 1.35, height: 32, overflow: "hidden", color: "#1B2430" }}>{p.name}</p>
        <Badges p={p} />
        <div style={{ fontSize: 16, fontWeight: 800, color: "#E8461C" }}>{Number(p.price).toLocaleString()}<span style={{ fontSize: 12, fontWeight: 700 }}>원</span></div>
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

  const handleView = (product) => {
    setViewed((prev) => [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 4));
    setProducts((prev) => {
      const sameCategory = prev.filter((p) => p.category === product.category);
      const others = prev.filter((p) => p.category !== product.category);
      return [...sameCategory, ...others];
    });
  };

  return (
    <div style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", background: "#F5F6F4", minHeight: "100%", color: "#1B2430" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap');
        .tile { transition: transform 0.12s ease, box-shadow 0.12s ease; }
        .tile:active { transform: scale(0.97); box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
      `}</style>

      <div style={{ maxWidth: 430, margin: "0 auto", background: "#F5F6F4" }}>
        <div style={{ borderBottom: "1px solid #E2E5E1", padding: "12px 18px" }}>
          <p style={{ fontSize: 11, color: "#6B7370", marginBottom: 4 }}>
            골프 좋아하시는 분이 클릭해주셨네요, 와주셔서 감사해요 🙂
          </p>
          <p style={{ fontSize: 10, color: "#8A9490" }}>
            이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>

        <div style={{ padding: "22px 18px 4px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.35, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            요즘 가장 잘 나가는<br />골프템 모음 🔥
          </h1>
          <p style={{ fontSize: 13, color: "#4A524F", fontWeight: 500 }}>
            지금 사람들이 제일 많이 담는 것들이에요
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
          <div style={{ padding: "18px 18px 4px" }}>
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
                <div key={p.id} style={{ border: "1px solid #E2E5E1", borderRadius: 4, padding: "8px 11px", fontSize: 11, background: "#fff" }}>
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
