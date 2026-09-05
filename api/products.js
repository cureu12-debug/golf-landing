import crypto from "crypto";

const DOMAIN = "https://api-gateway.coupang.com";
const SEARCH_PATH = "/v2/providers/affiliate_open_api/apis/openapi/products/search";

// 이 API는 한 번에 최대 10개만 반환하므로, 세부 키워드로 나눠 여러 번 호출해 합침
const PRIMARY_KEYWORD = "골프용품";
const EXTRA_KEYWORDS = ["골프장갑", "골프공", "골프우산", "골프모자", "골프가방", "골프거리측정기"];

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
  const datetime = getDatetime();
  const message = datetime + method + path + query;
  const signature = crypto.createHmac("sha256", secretKey).update(message).digest("hex");
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

async function fetchKeyword(keyword, accessKey, secretKey, isPrimary) {
  const pathWithQuery = `${SEARCH_PATH}?keyword=${encodeURIComponent(keyword)}&limit=10`;
  const authorization = generateHmac("GET", pathWithQuery, secretKey, accessKey);
  const response = await fetch(DOMAIN + pathWithQuery, {
    headers: { Authorization: authorization, "Content-Type": "application/json;charset=UTF-8" },
  });
  if (!response.ok) return [];
  const json = await response.json();
  const rawProducts = json?.data?.productData || [];
  return rawProducts.map((p, idx) => ({
    id: String(p.productId ?? `${keyword}-${idx}`),
    name: p.productName,
    price: p.productPrice,
    imageUrl: p.productImage,
    url: p.productUrl,
    rank: p.rank ?? idx + 1,
    category: p.categoryName,
    isRocket: p.isRocket,
    isFreeShipping: p.isFreeShipping,
    primary: isPrimary,
  }));
}

// 서버리스 함수 인스턴스가 살아있는 동안만 유지되는 임시 캐시
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

  try {
    const debugCounts = {};

    const primaryItems = await fetchKeyword(PRIMARY_KEYWORD, accessKey, secretKey, true);
    debugCounts[PRIMARY_KEYWORD] = primaryItems.length;

    const extraItemsNested = [];
    for (const kw of EXTRA_KEYWORDS) {
      const items = await fetchKeyword(kw, accessKey, secretKey, false);
      debugCounts[kw] = items.length;
      extraItemsNested.push(items);
    }
    const extraItems = extraItemsNested.flat();

    // productId 기준 중복 제거 (primary 결과를 우선 유지)
    const seen = new Set();
    const merged = [];
    for (const p of [...primaryItems, ...extraItems]) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      merged.push(p);
    }

    cache = { data: merged, fetchedAt: now };

    if (req.query.debug === "1") {
      return res.status(200).json({ totalMerged: merged.length, perKeywordCounts: debugCounts });
    }

    return res.status(200).json({ products: merged, cached: false });
  } catch (err) {
    return res.status(500).json({ error: "서버 오류", detail: String(err) });
  }
}
