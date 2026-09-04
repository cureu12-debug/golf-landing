import crypto from "crypto";

const DOMAIN = "https://api-gateway.coupang.com";
const SEARCH_PATH = "/v2/providers/affiliate_open_api/apis/openapi/products/search";

function getDatetime() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const yy = pad(d.getUTCFullYear() % 100);
  const MM = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const HH = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${yy}${MM}${dd}T${HH}${mm}${ss}Z`;
}

function generateHmac(method, pathWithQuery, secretKey, accessKey) {
  const [path, query = ""] = pathWithQuery.split("?");
  const datetime = getDatetime(); // yyMMddTHHmmssZ 형식 (UTC 기준)
  const message = datetime + method + path + query;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

// 서버리스 함수 인스턴스가 살아있는 동안만 유지되는 임시 캐시
// (완전한 영속 캐시가 필요하면 이후 Vercel KV 등으로 교체)
let cache = { data: null, fetchedAt: 0 };
const CACHE_TTL_MS = 10 * 60 * 1000; // 10분

export default async function handler(req, res) {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    return res.status(500).json({ error: "서버에 쿠팡 API 키가 설정되어 있지 않습니다." });
  }

  const now = Date.now();
  const isDebug = req.query.debug === "1";
  if (!isDebug && cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return res.status(200).json({ products: cache.data, cached: true });
  }

  const keyword = req.query.keyword || "골프용품";
  const limit = 10;
  const pathWithQuery = `${SEARCH_PATH}?keyword=${encodeURIComponent(keyword)}&limit=${limit}`;

  try {
    const authorization = generateHmac("GET", pathWithQuery, secretKey, accessKey);
    const response = await fetch(DOMAIN + pathWithQuery, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "쿠팡 API 호출 실패", detail: text });
    }

    const json = await response.json();

    // 🔍 임시 디버그: 실제 응답 구조를 확인하기 위한 코드
    if (req.query.debug === "1") {
      return res.status(200).json(json);
    }

    const rawProducts = json?.data?.productData || [];

    const products = rawProducts.map((p, idx) => ({
      id: String(p.productId ?? idx),
      name: p.productName,
      price: p.productPrice,
      imageUrl: p.productImage,
      url: p.productUrl,
      rank: idx + 1,
    }));

    cache = { data: products, fetchedAt: now };
    return res.status(200).json({ products, cached: false });
  } catch (err) {
    return res.status(500).json({ error: "서버 오류", detail: String(err) });
  }
}
