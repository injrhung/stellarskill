import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Starfield from "../components/Starfield.jsx";
import CornerBrackets from "../components/CornerBrackets.jsx";
import OrbViewport from "../components/OrbViewport.jsx";
import { useIdentity } from "../hooks/useIdentity.js";

const tabBase = { flex: 1, height: 40, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'Chakra Petch',sans-serif", fontSize: 14, letterSpacing: ".1em", transition: "all .2s" };
const activeTab = { ...tabBase, background: "linear-gradient(90deg,#5fd3ff,#a98bff)", color: "#04050c", fontWeight: 600 };
const idleTab = { ...tabBase, background: "transparent", color: "#8fa0c8" };

const roleBase = { flex: 1, padding: "14px 10px", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all .2s" };
const memberActive = { ...roleBase, border: "1px solid #5fd3ff", background: "rgba(95,211,255,.12)", color: "#dce6ff" };
const memberIdle = { ...roleBase, border: "1px solid rgba(95,211,255,.2)", background: "transparent", color: "#8fa0c8" };
const creatorActive = { ...roleBase, border: "1px solid #ffc857", background: "rgba(255,200,87,.12)", color: "#ffdf9a" };
const creatorIdle = { ...roleBase, border: "1px solid rgba(255,200,87,.2)", background: "transparent", color: "#8fa0c8" };

const inputStyle = { width: "100%", height: 46, background: "rgba(95,211,255,.05)", border: "1px solid rgba(95,211,255,.24)", borderRadius: 7, color: "#dce6ff", padding: "0 14px", fontSize: 14, outline: "none", fontFamily: "'Noto Sans TC',sans-serif" };
const labelStyle = { display: "block", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#8fa0c8", letterSpacing: ".12em", marginBottom: 8 };

export default function Login() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("member");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { setIdentity } = useIdentity();

  const isRegister = mode === "register";
  const isCreator = role === "creator";

  function submit() {
    setIdentity({ name: (isRegister && name.trim()) || "林航", role });
    navigate(isCreator ? "/admin" : "/explore");
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#04050c", fontFamily: "'Noto Sans TC',sans-serif" }}>
      {/* LEFT viewport */}
      <div style={{ position: "relative", flex: 1.15, minWidth: 0, overflow: "hidden", borderRight: "1px solid rgba(95,211,255,.16)" }}>
        <Starfield nebula="radial-gradient(900px 700px at 40% 40%,#132049 0%,#080b20 55%,#04050c 100%)" twinkleOpacity={0.6} />
        <CornerBrackets corners={["tl", "bl"]} />
        <OrbViewport top="46%" />
        <div style={{ position: "absolute", left: 48, bottom: 48, fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#8fa0c8", lineHeight: 1.8 }}>
          <div style={{ color: "#5fd3ff", letterSpacing: ".24em" }}>AUTH GATEWAY // 認證閘門</div>
          <div>驗證你的探索家身分以登艦</div>
          <div style={{ color: "#6b7aa0" }}>SECTOR 4C · STARDATE 3407.12</div>
        </div>
      </div>

      {/* RIGHT form */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: "radial-gradient(600px 500px at 70% 0%,#0d1330,#05060f)" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Chakra Petch',sans-serif", color: "#8fa0c8", fontSize: 12, letterSpacing: ".14em", marginBottom: 34 }}>◂ 返回星域</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#5fd3ff", boxShadow: "0 0 10px #5fd3ff" }} />
            <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#dce6ff", fontWeight: 700, letterSpacing: ".2em", fontSize: 15 }}>STELLAR ARCHIVE</span>
          </div>
          <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#eaf1ff", fontSize: 26, margin: "14px 0 4px", fontWeight: 600 }}>{isRegister ? "登記新的探索家" : "歡迎回到艦橋"}</h1>
          <p style={{ color: "#6b7aa0", fontFamily: "'Space Mono',monospace", fontSize: 12, margin: "0 0 26px" }}>{isRegister ? "REGISTER NEW EXPLORER" : "AUTHENTICATE TO BOARD"}</p>

          <div style={{ display: "flex", gap: 6, padding: 5, border: "1px solid rgba(95,211,255,.18)", borderRadius: 8, marginBottom: 24 }}>
            <button onClick={() => setMode("login")} style={isRegister ? idleTab : activeTab}>登入</button>
            <button onClick={() => setMode("register")} style={isRegister ? activeTab : idleTab}>註冊</button>
          </div>

          {isRegister && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>探索家代號</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 林航" style={inputStyle} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>星際通訊 ID (Email)</label>
            <input placeholder="explorer@stellar.io" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>通行密語</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>登艦身分</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setRole("member")} style={isCreator ? memberIdle : memberActive}>
                <span style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 14 }}>探索家</span>
                <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: 10, opacity: 0.7, marginTop: 3 }}>MEMBER · 瀏覽收藏</span>
              </button>
              <button onClick={() => setRole("creator")} style={isCreator ? creatorActive : creatorIdle}>
                <span style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 14 }}>造物者</span>
                <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: 10, opacity: 0.7, marginTop: 3 }}>CREATOR · 管理星系</span>
              </button>
            </div>
          </div>

          <button
            onClick={submit}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: 50, background: "#5fd3ff", color: "#04050c", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 15, border: "none", borderRadius: 8, letterSpacing: ".1em", boxShadow: "0 0 30px rgba(95,211,255,.35)", cursor: "pointer" }}
          >
            {isRegister ? "建立帳號並登艦" : "登入艦橋"} ▸
          </button>
          <p style={{ textAlign: "center", color: "#6b7aa0", fontSize: 12, marginTop: 18, fontFamily: "'Space Mono',monospace" }}>
            {isCreator ? "造物者將進入控制台 · CREATOR CONSOLE" : "探索家將進入星圖 · STAR CHART"}
          </p>
        </div>
      </div>
    </div>
  );
}
