import { Link } from "react-router-dom";
import Starfield from "../components/Starfield.jsx";

const navLinkStyle = { color: "#8fa0c8" };

const missionCards = [
  {
    galaxy: "words",
    name: "寫作星系",
    color: "#c9b8ff",
    border: "rgba(169,139,255,.32)",
    dotBg: "radial-gradient(circle at 34% 30%,#d8c6ff,#a98bff 60%)",
    glow: "rgba(169,139,255,.5)",
    desc: "文案、敘事、潤稿類 prompt 的家園。",
    tag: "NEBULA OF WORDS · 5 PLANETS →",
  },
  {
    galaxy: "code",
    name: "程式星系",
    color: "#9fe0ff",
    border: "rgba(95,211,255,.32)",
    dotBg: "radial-gradient(circle at 34% 30%,#bfefff,#5fd3ff 60%)",
    glow: "rgba(95,211,255,.5)",
    desc: "除錯、重構、架構設計的技能航線。",
    tag: "CODE CLUSTER · 5 PLANETS →",
  },
  {
    galaxy: "market",
    name: "行銷星系",
    color: "#ffdf9a",
    border: "rgba(255,200,87,.32)",
    dotBg: "radial-gradient(circle at 34% 30%,#ffe9b8,#ffc857 60%)",
    glow: "rgba(255,200,87,.5)",
    desc: "品牌、社群、成長策略的行星群。",
    tag: "MARKET CONSTELLATION · 4 →",
  },
];

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden", background: "#04050c", fontFamily: "'Noto Sans TC',sans-serif" }}>
      <Starfield nebula="radial-gradient(1400px 1000px at 50% 128%,#1b2f6b 0%,#0a1130 44%,#04050c 100%)" dotOpacity={1} twinkleOpacity={0.6} />

      {/* planet horizon */}
      <div style={{ position: "absolute", left: "50%", bottom: "-58vw", width: "112vw", height: "112vw", transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(circle at 50% 20%,#3a6fd8 0%,#1a2f7a 40%,#0a1230 70%)", boxShadow: "0 -30px 160px rgba(95,150,255,.4)" }} />
      <div style={{ position: "absolute", left: "50%", bottom: 0, width: "112vw", height: "24vh", transform: "translateX(-50%)", background: "linear-gradient(180deg,rgba(159,220,255,.12),transparent)" }} />
      {/* moonlet */}
      <div style={{ position: "absolute", left: "50%", top: "22vh", width: 60, height: 60, transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(circle at 34% 30%,#dfe8ff,#8fa8e6 55%,#3a4a80 100%)", boxShadow: "0 0 40px rgba(159,190,255,.5)", animation: "floatY 9s ease-in-out infinite" }} />

      {/* top bar */}
      <div style={{ position: "relative", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(24px,4vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Chakra Petch',sans-serif" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#5fd3ff", boxShadow: "0 0 10px #5fd3ff" }} />
          <span style={{ color: "#dce6ff", fontWeight: 700, letterSpacing: ".24em", fontSize: 15 }}>STELLAR ARCHIVE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: "'Chakra Petch',sans-serif", fontSize: 14, color: "#8fa0c8", letterSpacing: ".06em" }}>
          <Link to="/explore" style={navLinkStyle}>星圖</Link>
          <Link to="/galaxy" style={navLinkStyle}>3D 銀河</Link>
          <Link to="/voyage" style={navLinkStyle}>我的航線</Link>
          <Link to="/admin" style={navLinkStyle}>控制台</Link>
          <Link to="/login" style={{ border: "1px solid rgba(95,211,255,.45)", borderRadius: 5, padding: "8px 18px", color: "#5fd3ff" }}>登入艦橋</Link>
        </div>
      </div>

      {/* hero */}
      <div style={{ position: "relative", textAlign: "center", padding: "clamp(80px,12vh,150px) 40px 0", animation: "rise .9s ease both" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: "#5fd3ff", letterSpacing: ".42em", marginBottom: 22 }}>— 探索家日誌 · STARDATE 3407 —</div>
        <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, color: "#eaf1ff", fontSize: "clamp(42px,6vw,80px)", lineHeight: 1.05, margin: 0, letterSpacing: ".01em", textShadow: "0 0 46px rgba(95,150,255,.4)" }}>
          駕駛你的太空船<br />穿越技能的星系
        </h1>
        <p style={{ color: "#aebbdd", fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.8, maxWidth: 640, margin: "28px auto 0" }}>
          每一個 skill 與 prompt 都是一顆等待登陸的行星。搜索星系、標記航點，建立屬於你的星圖。
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40 }}>
          <Link to="/login" style={{ background: "#5fd3ff", color: "#04050c", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 15, padding: "15px 36px", borderRadius: 6, letterSpacing: ".08em", boxShadow: "0 0 34px rgba(95,211,255,.4)" }}>▶ 開始航行</Link>
          <Link to="/explore" style={{ border: "1px solid rgba(95,211,255,.4)", color: "#dce6ff", fontFamily: "'Chakra Petch',sans-serif", fontSize: 15, padding: "15px 36px", borderRadius: 6, letterSpacing: ".08em" }}>瀏覽星圖</Link>
        </div>
      </div>

      {/* mission cards */}
      <div style={{ position: "relative", display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", padding: "clamp(60px,9vh,110px) clamp(24px,5vw,80px) 70px" }}>
        {missionCards.map((c) => (
          <Link
            key={c.galaxy}
            to={`/explore?g=${c.galaxy}`}
            style={{ flex: 1, minWidth: 300, maxWidth: 380, border: `1px solid ${c.border}`, borderRadius: 12, padding: 24, background: "rgba(10,16,38,.55)", backdropFilter: "blur(6px)", display: "block" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", background: c.dotBg, boxShadow: `0 0 22px ${c.glow}` }} />
              <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: c.color, fontSize: 17 }}>{c.name}</span>
            </div>
            <p style={{ color: "#8fa0c8", fontSize: 13.5, lineHeight: 1.75, margin: "15px 0 0" }}>{c.desc}</p>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", marginTop: 16 }}>{c.tag}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
