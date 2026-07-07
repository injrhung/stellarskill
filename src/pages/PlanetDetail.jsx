import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GALAXIES, PLANETS, diffStars } from "../data.js";
import PageTopBar from "../components/PageTopBar.jsx";
import CornerBrackets from "../components/CornerBrackets.jsx";
import Starfield from "../components/Starfield.jsx";
import { useIdentity } from "../hooks/useIdentity.js";
import { useFavorites } from "../hooks/useFavorites.js";

export default function PlanetDetail() {
  const { id } = useParams();
  const { identity } = useIdentity();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  const p = useMemo(() => PLANETS.find((x) => x.id === id) || PLANETS[0], [id]);
  const g = useMemo(() => GALAXIES.find((x) => x.id === p.galaxy), [p]);
  const related = useMemo(
    () => PLANETS.filter((x) => x.galaxy === p.galaxy && x.id !== p.id).slice(0, 3),
    [p],
  );

  const col = g.color;
  const isFav = isFavorite(p.id);

  function copy() {
    try { navigator.clipboard.writeText(p.body); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const favBtnStyle = isFav
    ? { height: 48, padding: "0 26px", background: "rgba(95,211,255,.14)", color: "#5fd3ff", border: "1px solid rgba(95,211,255,.5)", borderRadius: 8, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: ".08em", cursor: "pointer" }
    : { height: 48, padding: "0 26px", background: "#5fd3ff", color: "#04050c", border: "none", borderRadius: 8, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: ".08em", cursor: "pointer", boxShadow: "0 0 24px rgba(95,211,255,.3)" };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#04050c", fontFamily: "'Noto Sans TC',sans-serif" }}>
      <PageTopBar
        backHref="/explore"
        backLabel="◂ 返回星圖"
        title={`${p.coord} · LANDED`}
        titleColor="#6b7aa0"
        right={(
          <>
            <Link to="/voyage" style={{ color: "#8fa0c8" }}>我的航線</Link>
            <span style={{ color: "#5fd3ff" }}>探索家 · {identity.name}</span>
          </>
        )}
      />

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", minHeight: "calc(100vh - 56px)" }}>
        {/* LEFT viewport */}
        <div style={{ position: "relative", overflow: "hidden", borderRight: "1px solid rgba(95,211,255,.12)" }}>
          <Starfield nebula={`radial-gradient(700px 600px at 50% 45%,${col}22 0%,#080b20 55%,#04050c 100%)`} twinkleOpacity={0.55} />
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 420, height: 420, border: "1px solid rgba(95,211,255,.14)", borderRadius: "50%", animation: "spinSlow 55s linear infinite" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, border: `1px dashed ${col}33`, borderRadius: "50%", animation: "spinRev 80s linear infinite" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #fff, ${col} 42%, ${col}66 66%, #0a1030 100%)`, boxShadow: `0 0 90px ${col}77, inset -32px -24px 78px rgba(0,0,0,.6)`, animation: "drift 13s ease-in-out infinite" }} />
          <div style={{ position: "absolute", left: 36, bottom: 32, fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#8fa0c8", lineHeight: 1.9 }}>
            <div style={{ color: col, letterSpacing: ".2em" }}>PLANET SURVEY // 行星勘測</div>
            <div>座標 {p.coord} · 難度 {diffStars(p.difficulty)}</div>
            <div style={{ color: "#6b7aa0" }}>屬 {g.name} · {g.en}</div>
          </div>
          <CornerBrackets corners={["tl", "tr"]} size={30} offset={24} />
        </div>

        {/* RIGHT content */}
        <div style={{ padding: "52px clamp(32px,4vw,64px)", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'Chakra Petch',sans-serif", fontSize: 12, color: col, border: `1px solid ${col}66`, borderRadius: 20, padding: "5px 12px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}` }} />{g.name}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#04050c", background: col, borderRadius: 4, padding: "4px 10px", letterSpacing: ".1em" }}>{p.type.toUpperCase()}</span>
          </div>

          <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#eaf1ff", fontSize: 38, margin: "0 0 6px", fontWeight: 600 }}>{p.name}</h1>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: col, letterSpacing: ".1em", marginBottom: 24 }}>{p.en}</div>
          <p style={{ color: "#aebbdd", fontSize: 16, lineHeight: 1.85, margin: "0 0 30px", maxWidth: 620 }}>{p.summary}</p>

          <div style={{ display: "flex", gap: 14, marginBottom: 32 }}>
            <div style={{ flex: 1, border: "1px solid rgba(95,211,255,.16)", borderRadius: 9, padding: "14px 16px" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0", letterSpacing: ".1em" }}>難度 DIFFICULTY</div>
              <div style={{ color: col, fontSize: 17, marginTop: 4 }}>{diffStars(p.difficulty)}</div>
            </div>
            <div style={{ flex: 1, border: "1px solid rgba(95,211,255,.16)", borderRadius: 9, padding: "14px 16px" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0", letterSpacing: ".1em" }}>航行次數 VOYAGES</div>
              <div style={{ color: "#dce6ff", fontFamily: "'Chakra Petch',sans-serif", fontSize: 18, marginTop: 4 }}>{p.uses.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, border: "1px solid rgba(95,211,255,.16)", borderRadius: 9, padding: "14px 16px" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0", letterSpacing: ".1em" }}>座標 COORD</div>
              <div style={{ color: "#dce6ff", fontFamily: "'Space Mono',monospace", fontSize: 16, marginTop: 6 }}>{p.coord}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: col, letterSpacing: ".2em" }}>▤ TRANSMISSION // {p.type.toUpperCase()} 內容</div>
            <button
              onClick={copy}
              style={{ border: `1px solid ${col}66`, background: copied ? `${col}22` : "transparent", color: col, fontFamily: "'Chakra Petch',sans-serif", fontSize: 12, letterSpacing: ".08em", padding: "7px 16px", borderRadius: 6, cursor: "pointer", transition: "all .2s" }}
            >
              {copied ? "✓ 已複製" : "⧉ 複製"}
            </button>
          </div>
          <div style={{ position: "relative", border: "1px solid rgba(95,211,255,.2)", borderRadius: 10, background: "rgba(8,14,32,.7)", padding: 22, fontFamily: "'Space Mono',monospace", fontSize: 14, lineHeight: 1.9, color: "#cfe0ff" }}>
            <div style={{ position: "absolute", top: 0, left: 22, right: 22, height: 1, background: `linear-gradient(90deg,transparent,${col},transparent)` }} />
            {p.body}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            <button onClick={() => toggleFavorite(p.id)} style={favBtnStyle}>{isFav ? "✓ 已收藏至航點" : "✦ 收藏至航點"}</button>
            <Link to="/explore" style={{ height: 48, display: "inline-flex", alignItems: "center", padding: "0 26px", border: "1px solid rgba(95,211,255,.3)", color: "#dce6ff", borderRadius: 8, fontFamily: "'Chakra Petch',sans-serif", fontSize: 14, letterSpacing: ".08em" }}>◂ 回星圖</Link>
          </div>

          <div style={{ marginTop: 44, paddingTop: 26, borderTop: "1px solid rgba(95,211,255,.12)" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", letterSpacing: ".16em", marginBottom: 14 }}>同星系鄰近行星 · NEARBY IN {g.en}</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {related.map((r) => (
                <Link key={r.id} to={`/planet/${r.id}`} style={{ flex: 1, minWidth: 180, border: "1px solid rgba(95,211,255,.16)", borderRadius: 9, padding: "14px 16px", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: col, boxShadow: `0 0 12px ${col}88` }} />
                    <span style={{ color: "#dce6ff", fontFamily: "'Chakra Petch',sans-serif", fontSize: 14 }}>{r.name}</span>
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0", marginTop: 8 }}>{r.coord} · {r.type.toUpperCase()}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
