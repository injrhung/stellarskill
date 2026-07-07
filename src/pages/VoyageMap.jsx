import { Link } from "react-router-dom";
import { GALAXIES, PLANETS, diffStars } from "../data.js";
import PageTopBar, { ExplorerBadge } from "../components/PageTopBar.jsx";
import Starfield from "../components/Starfield.jsx";
import { useIdentity } from "../hooks/useIdentity.js";
import { useFavorites } from "../hooks/useFavorites.js";

export default function VoyageMap() {
  const { identity } = useIdentity();
  const { favIds, removeFavorite } = useFavorites();

  const items = favIds.map((id) => PLANETS.find((p) => p.id === id)).filter(Boolean);
  const isEmpty = items.length === 0;

  const galSet = new Set(items.map((p) => p.galaxy));
  const avgDiff = items.length ? items.reduce((s, p) => s + p.difficulty, 0) / items.length : 0;
  const stats = {
    count: items.length,
    galaxies: galSet.size,
    diff: items.length ? avgDiff.toFixed(1) + "★" : "—",
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#04050c", fontFamily: "'Noto Sans TC',sans-serif" }}>
      <PageTopBar
        title="MY VOYAGE MAP · 我的航線地圖"
        right={(
          <>
            <Link to="/explore" style={{ color: "#8fa0c8" }}>星圖</Link>
            <ExplorerBadge name={identity.name} />
          </>
        )}
      />

      <div style={{ position: "relative", overflow: "hidden" }}>
        <Starfield nebula="radial-gradient(1000px 640px at 50% -10%,#152049 0%,#070a1e 55%,#04050c 100%)" />

        <div style={{ position: "relative", padding: "48px clamp(24px,5vw,64px) 90px", maxWidth: 960, margin: "0 auto" }}>
          {/* header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#5fd3ff", letterSpacing: ".3em", marginBottom: 14 }}>VOYAGE LOG · 個人收藏</div>
            <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, color: "#eaf1ff", fontSize: "clamp(30px,4vw,42px)", margin: "0 0 10px", letterSpacing: ".01em" }}>我的航線地圖</h1>
            <p style={{ color: "#8fa0c8", fontSize: 14.5, lineHeight: 1.75, margin: 0, maxWidth: 520 }}>你收藏的每一顆行星，依標記順序串成一條專屬航線。</p>

            <div style={{ display: "flex", gap: 14, marginTop: 26, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 150, border: "1px solid rgba(95,211,255,.18)", borderRadius: 10, padding: "16px 18px", background: "rgba(8,14,32,.5)" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0", letterSpacing: ".1em" }}>已收藏航點</div>
                <div style={{ color: "#dce6ff", fontFamily: "'Chakra Petch',sans-serif", fontSize: 26, marginTop: 6 }}>{stats.count}</div>
              </div>
              <div style={{ flex: 1, minWidth: 150, border: "1px solid rgba(95,211,255,.18)", borderRadius: 10, padding: "16px 18px", background: "rgba(8,14,32,.5)" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0", letterSpacing: ".1em" }}>橫跨星系</div>
                <div style={{ color: "#dce6ff", fontFamily: "'Chakra Petch',sans-serif", fontSize: 26, marginTop: 6 }}>{stats.galaxies}</div>
              </div>
              <div style={{ flex: 1, minWidth: 150, border: "1px solid rgba(95,211,255,.18)", borderRadius: 10, padding: "16px 18px", background: "rgba(8,14,32,.5)" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0", letterSpacing: ".1em" }}>平均難度</div>
                <div style={{ color: "#ffc857", fontFamily: "'Chakra Petch',sans-serif", fontSize: 26, marginTop: 6 }}>{stats.diff}</div>
              </div>
            </div>
          </div>

          {isEmpty ? (
            <div style={{ border: "1px dashed rgba(95,211,255,.28)", borderRadius: 12, padding: "70px 30px", textAlign: "center" }}>
              <div style={{ fontSize: 42, color: "#3a4360", marginBottom: 16 }}>◎</div>
              <div style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#dce6ff", fontSize: 17, letterSpacing: ".04em" }}>尚未標記任何航點</div>
              <p style={{ color: "#6b7aa0", fontSize: 13, lineHeight: 1.8, margin: "10px 0 26px" }}>前往星圖，找到值得收藏的 skill 或 prompt，在行星詳情頁點選「收藏至航點」。</p>
              <Link to="/explore" style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 28px", background: "#5fd3ff", color: "#04050c", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 14, borderRadius: 8, letterSpacing: ".08em", boxShadow: "0 0 24px rgba(95,211,255,.3)" }}>▶ 前往星圖探索</Link>
            </div>
          ) : (
            <div>
              {items.map((p, i) => {
                const g = GALAXIES.find((x) => x.id === p.galaxy) || { color: "#5fd3ff", name: "—", en: "" };
                const col = g.color;
                const isLast = i === items.length - 1;
                return (
                  <div key={p.id} style={{ display: "flex", gap: 20 }}>
                    {/* rail */}
                    <div style={{ flex: "none", width: 44, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #fff, ${col} 60%)`, boxShadow: `0 0 18px ${col}88`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#04050c", fontWeight: 700, flex: "none" }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div style={isLast ? { flex: 1, width: 0 } : { flex: 1, width: 2, minHeight: 20, background: `linear-gradient(180deg,${col}55,rgba(95,211,255,.12))`, marginTop: 4 }} />
                    </div>
                    {/* card */}
                    <div style={{ flex: 1, border: "1px solid rgba(95,211,255,.16)", borderRadius: 12, padding: "20px 22px", marginBottom: 22, background: "rgba(8,14,32,.55)", backdropFilter: "blur(4px)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Chakra Petch',sans-serif", fontSize: 11, color: col, border: `1px solid ${col}66`, borderRadius: 20, padding: "4px 11px" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, boxShadow: `0 0 6px ${col}` }} />{g.name}
                        </span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#04050c", background: col, borderRadius: 4, padding: "3px 9px", letterSpacing: ".08em" }}>{p.type.toUpperCase()}</span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", marginLeft: "auto" }}>{p.coord}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14 }}>
                        <div>
                          <Link to={`/planet/${p.id}`} style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#eaf1ff", fontSize: 18 }}>{p.name}</Link>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: col, marginTop: 3, letterSpacing: ".06em" }}>{p.en}</div>
                        </div>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#ffc857", flex: "none" }}>{diffStars(p.difficulty)}</span>
                      </div>
                      <p style={{ color: "#aebbdd", fontSize: 13.5, lineHeight: 1.75, margin: "12px 0 0" }}>{p.summary}</p>
                      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <Link to={`/planet/${p.id}`} style={{ height: 38, display: "inline-flex", alignItems: "center", padding: "0 18px", border: "1px solid rgba(95,211,255,.3)", color: "#dce6ff", borderRadius: 7, fontFamily: "'Chakra Petch',sans-serif", fontSize: 12.5, letterSpacing: ".06em" }}>▶ 登陸行星</Link>
                        <button onClick={() => removeFavorite(p.id)} style={{ height: 38, padding: "0 18px", border: "1px solid rgba(255,110,110,.35)", background: "transparent", color: "#ff8a8a", borderRadius: 7, fontFamily: "'Chakra Petch',sans-serif", fontSize: 12.5, letterSpacing: ".06em", cursor: "pointer" }}>✕ 移除航點</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
