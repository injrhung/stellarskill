import { useState } from "react";
import { Link } from "react-router-dom";
import { GALAXIES, PLANETS } from "../data.js";

const PALETTE = ["#a98bff", "#5fd3ff", "#ffc857", "#6be5a0", "#ff8fb3"];
const uid = () => "x" + Math.random().toString(36).slice(2, 8);

const lblStyle = { display: "block", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#8fa0c8", letterSpacing: ".1em", marginBottom: 8 };
const inputStyle = { width: "100%", height: 44, background: "rgba(95,211,255,.05)", border: "1px solid rgba(95,211,255,.24)", borderRadius: 7, color: "#dce6ff", padding: "0 13px", fontSize: 14, outline: "none", fontFamily: "'Noto Sans TC',sans-serif" };
const navBase = { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 13px", borderRadius: 8, cursor: "pointer", fontFamily: "'Noto Sans TC',sans-serif", fontSize: 14, marginBottom: 8, transition: "all .15s", border: "none" };
const navOn = { border: "1px solid rgba(255,200,87,.4)", background: "rgba(255,200,87,.12)", color: "#ffdf9a" };
const navOff = { border: "1px solid rgba(95,211,255,.12)", background: "transparent", color: "#8fa0c8" };
const chipBase = { height: 34, padding: "0 16px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'Noto Sans TC',sans-serif", transition: "all .15s", border: "none" };
const typeTabBase = { flex: 1, height: 34, borderRadius: 7, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 12, border: "none" };

export default function AdminConsole() {
  const [view, setView] = useState("galaxies");
  const [galaxies, setGalaxies] = useState(() => GALAXIES.map((g) => ({ ...g })));
  const [planets, setPlanets] = useState(() => PLANETS.map((p) => ({ ...p })));
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(null); // { kind: 'galaxy'|'planet', isNew, data }

  const isGal = view === "galaxies";
  const countFor = (gid) => planets.filter((p) => p.galaxy === gid).length;
  const galById = (id) => galaxies.find((g) => g.id === id) || { name: "—", color: "#5fd3ff", en: "" };

  function openGalaxyForm(g) {
    setForm({ kind: "galaxy", isNew: !g, data: g ? { ...g } : { id: uid(), name: "", en: "", desc: "", color: PALETTE[0] } });
  }
  function openPlanetForm(p) {
    const g0 = galaxies[0];
    setForm({ kind: "planet", isNew: !p, data: p ? { ...p } : { id: uid(), name: "", en: "", galaxy: g0 ? g0.id : "", type: "prompt", coord: "", difficulty: 2, uses: 0, summary: "", body: "" } });
  }
  function set(key, value) {
    setForm((f) => ({ ...f, data: { ...f.data, [key]: value } }));
  }
  function save() {
    const d = form.data;
    if (form.kind === "galaxy") {
      setGalaxies((arr) => {
        const i = arr.findIndex((x) => x.id === d.id);
        const next = [...arr];
        if (i >= 0) next[i] = d; else next.push(d);
        return next;
      });
    } else {
      const d2 = { ...d, difficulty: Number(d.difficulty) };
      setPlanets((arr) => {
        const i = arr.findIndex((x) => x.id === d2.id);
        const next = [...arr];
        if (i >= 0) next[i] = d2; else next.push(d2);
        return next;
      });
    }
    setForm(null);
  }
  function delGalaxy(id) {
    setGalaxies((arr) => arr.filter((g) => g.id !== id));
    setPlanets((arr) => arr.filter((p) => p.galaxy !== id));
  }
  function delPlanet(id) {
    setPlanets((arr) => arr.filter((p) => p.id !== id));
  }

  const chips = [{ id: "all", label: "全部" }].concat(galaxies.map((g) => ({ id: g.id, label: g.name })));
  const planetRows = planets.filter((p) => filter === "all" || p.galaxy === filter);
  const fd = form ? form.data : {};

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: "#05070f", fontFamily: "'Noto Sans TC',sans-serif" }}>
      {/* top bar */}
      <div style={{ flex: "none", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid rgba(255,200,87,.2)", background: "rgba(14,11,4,.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/" style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#8fa0c8", fontSize: 12, letterSpacing: ".14em" }}>◂ 星域</Link>
          <span style={{ width: 1, height: 18, background: "rgba(255,200,87,.25)" }} />
          <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#ffdf9a", fontWeight: 600, letterSpacing: ".14em", fontSize: 14 }}>CREATOR CONSOLE · 造物者控制台</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#8fa0c8" }}>
          <span style={{ border: "1px solid rgba(255,200,87,.4)", color: "#ffc857", borderRadius: 20, padding: "4px 12px", letterSpacing: ".1em" }}>✦ 造物者 CREATOR</span>
          <span style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,200,87,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffc857" }}>造</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "210px 1fr" }}>
        {/* nav */}
        <div style={{ borderRight: "1px solid rgba(255,200,87,.12)", padding: "22px 16px", background: "rgba(10,9,4,.4)" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", letterSpacing: ".2em", marginBottom: 14 }}>MANAGE // 管理</div>
          <button onClick={() => setView("galaxies")} style={{ ...navBase, ...(isGal ? navOn : navOff) }}><span>◎</span> 星系 <span style={{ marginLeft: "auto", fontFamily: "'Space Mono',monospace", fontSize: 11, opacity: 0.7 }}>{galaxies.length}</span></button>
          <button onClick={() => setView("planets")} style={{ ...navBase, ...(!isGal ? navOn : navOff) }}><span>◉</span> 行星 <span style={{ marginLeft: "auto", fontFamily: "'Space Mono',monospace", fontSize: 11, opacity: 0.7 }}>{planets.length}</span></button>
          <div style={{ marginTop: 26, padding: 14, border: "1px solid rgba(255,200,87,.15)", borderRadius: 8 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0" }}>系統狀態</div>
            <div style={{ color: "#ffdf9a", fontFamily: "'Chakra Petch',sans-serif", fontSize: 13, marginTop: 6 }}>ARCHIVE ONLINE</div>
            <div style={{ color: "#5a6788", fontFamily: "'Space Mono',monospace", fontSize: 10, marginTop: 4 }}>最後同步 3407.12</div>
          </div>
        </div>

        {/* main */}
        <div style={{ padding: "28px 34px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#eaf1ff", fontSize: 24, margin: 0, fontWeight: 600 }}>{isGal ? "星系管理" : "行星管理"}</h1>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#6b7aa0", marginTop: 4 }}>{isGal ? `GALAXIES · ${galaxies.length} 個類別` : `PLANETS · ${planets.length} 個 skill / prompt`}</div>
            </div>
            <button onClick={() => (isGal ? openGalaxyForm(null) : openPlanetForm(null))} style={{ height: 42, padding: "0 22px", background: "#ffc857", color: "#1a1405", border: "none", borderRadius: 8, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: ".08em", cursor: "pointer", boxShadow: "0 0 22px rgba(255,200,87,.3)" }}>+ {isGal ? "命名新星系" : "新增行星"}</button>
          </div>

          {isGal ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
              {galaxies.map((g) => (
                <div key={g.id} style={{ border: `1px solid ${g.color}3a`, borderRadius: 12, padding: 20, background: `${g.color}0d` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 30, height: 30, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%,#fff,${g.color} 60%)`, boxShadow: `0 0 18px ${g.color}88` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#eaf1ff", fontSize: 16 }}>{g.name}</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0" }}>{g.en}</div>
                    </div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#8fa0c8" }}>{countFor(g.id)} 行星</span>
                  </div>
                  <p style={{ color: "#8fa0c8", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px", minHeight: 38 }}>{g.desc}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openGalaxyForm(g)} style={{ flex: 1, height: 34, border: "1px solid rgba(95,211,255,.3)", background: "transparent", color: "#5fd3ff", borderRadius: 6, fontFamily: "'Chakra Petch',sans-serif", fontSize: 12, cursor: "pointer" }}>✎ 編輯</button>
                    <button onClick={() => delGalaxy(g.id)} style={{ height: 34, padding: "0 14px", border: "1px solid rgba(255,110,110,.35)", background: "transparent", color: "#ff8a8a", borderRadius: 6, fontFamily: "'Chakra Petch',sans-serif", fontSize: 12, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {chips.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilter(c.id)}
                    style={{ ...chipBase, ...(filter === c.id ? { border: "1px solid #ffc857", background: "rgba(255,200,87,.14)", color: "#ffdf9a" } : { border: "1px solid rgba(95,211,255,.18)", background: "transparent", color: "#8fa0c8" }) }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div style={{ border: "1px solid rgba(95,211,255,.14)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 0.8fr 0.7fr 0.9fr 110px", padding: "12px 18px", background: "rgba(95,211,255,.06)", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#8fa0c8", letterSpacing: ".08em" }}>
                  <span>名稱 NAME</span><span>星系 GALAXY</span><span>類型</span><span>座標</span><span>難度</span><span style={{ textAlign: "right" }}>操作</span>
                </div>
                {planetRows.map((p) => {
                  const g = galById(p.galaxy);
                  return (
                    <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 0.8fr 0.7fr 0.9fr 110px", alignItems: "center", padding: "13px 18px", borderTop: "1px solid rgba(95,211,255,.08)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 16, height: 16, borderRadius: "50%", background: g.color, boxShadow: `0 0 10px ${g.color}88`, flex: "none" }} />
                        <div>
                          <div style={{ color: "#dce6ff", fontSize: 14 }}>{p.name}</div>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0" }}>{p.en}</div>
                        </div>
                      </div>
                      <span style={{ color: "#aebbdd", fontSize: 13 }}>{g.name}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: p.type === "skill" ? "#5fd3ff" : "#a98bff" }}>{p.type}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#8fa0c8" }}>{p.coord}</span>
                      <span style={{ color: "#ffc857", fontSize: 12 }}>{"★".repeat(p.difficulty)}</span>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button onClick={() => openPlanetForm(p)} style={{ width: 32, height: 32, border: "1px solid rgba(95,211,255,.3)", background: "transparent", color: "#5fd3ff", borderRadius: 6, cursor: "pointer" }}>✎</button>
                        <button onClick={() => delPlanet(p.id)} style={{ width: 32, height: 32, border: "1px solid rgba(255,110,110,.35)", background: "transparent", color: "#ff8a8a", borderRadius: 6, cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DRAWER / MODAL */}
      {form && (
        <>
          <div onClick={() => setForm(null)} style={{ position: "fixed", inset: 0, background: "rgba(2,3,8,.7)", backdropFilter: "blur(3px)", zIndex: 40 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 440, zIndex: 50, background: "#0a0e1c", borderLeft: "1px solid rgba(255,200,87,.22)", padding: 30, overflowY: "auto", boxShadow: "-30px 0 60px rgba(0,0,0,.5)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#ffc857", letterSpacing: ".2em" }}>{form.kind === "galaxy" ? "GALAXY" : "PLANET"}</div>
                <h2 style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#eaf1ff", fontSize: 20, margin: "6px 0 0" }}>
                  {form.isNew ? (form.kind === "galaxy" ? "命名新星系" : "登錄新行星") : (form.kind === "galaxy" ? "編輯星系" : "編輯行星")}
                </h2>
              </div>
              <button onClick={() => setForm(null)} style={{ width: 34, height: 34, border: "1px solid rgba(95,211,255,.24)", background: "transparent", color: "#8fa0c8", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {form.kind === "galaxy" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div><label style={lblStyle}>星系名稱</label><input value={fd.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. 設計星系" style={inputStyle} /></div>
                <div><label style={lblStyle}>英文代號</label><input value={fd.en} onChange={(e) => set("en", e.target.value)} placeholder="e.g. DESIGN SYSTEM" style={inputStyle} /></div>
                <div><label style={lblStyle}>星系描述</label><textarea value={fd.desc} onChange={(e) => set("desc", e.target.value)} placeholder="這個類別收藏什麼？" style={{ ...inputStyle, height: 80, paddingTop: 10 }} /></div>
                <div>
                  <label style={lblStyle}>星系色彩</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {PALETTE.map((c) => (
                      <button key={c} onClick={() => set("color", c)} style={{ width: 40, height: 40, borderRadius: "50%", cursor: "pointer", background: c, boxShadow: `0 0 14px ${c}88`, border: fd.color === c ? "3px solid #fff" : "2px solid transparent" }} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div><label style={lblStyle}>行星名稱</label><input value={fd.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. 摘要器" style={inputStyle} /></div>
                <div><label style={lblStyle}>英文代號</label><input value={fd.en} onChange={(e) => set("en", e.target.value)} placeholder="e.g. Digest" style={inputStyle} /></div>
                <div>
                  <label style={lblStyle}>歸屬星系</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {galaxies.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => set("galaxy", g.id)}
                        style={{ height: 34, padding: "0 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'Noto Sans TC',sans-serif", border: "none", ...(fd.galaxy === g.id ? { border: `1px solid ${g.color}`, background: `${g.color}22`, color: "#fff" } : { border: "1px solid rgba(95,211,255,.18)", background: "transparent", color: "#8fa0c8" }) }}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={lblStyle}>類型</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => set("type", "skill")} style={{ ...typeTabBase, ...(fd.type === "skill" ? { border: "1px solid #5fd3ff", background: "#5fd3ff22", color: "#5fd3ff" } : { border: "1px solid rgba(95,211,255,.16)", background: "transparent", color: "#5a6788" }) }}>skill</button>
                      <button onClick={() => set("type", "prompt")} style={{ ...typeTabBase, ...(fd.type === "prompt" ? { border: "1px solid #a98bff", background: "#a98bff22", color: "#a98bff" } : { border: "1px solid rgba(95,211,255,.16)", background: "transparent", color: "#5a6788" }) }}>prompt</button>
                    </div>
                  </div>
                  <div style={{ width: 110 }}><label style={lblStyle}>座標</label><input value={fd.coord} onChange={(e) => set("coord", e.target.value)} placeholder="XX-000" style={inputStyle} /></div>
                </div>
                <div><label style={lblStyle}>難度 ({fd.difficulty}★)</label><input type="range" min="1" max="5" value={fd.difficulty} onChange={(e) => set("difficulty", Number(e.target.value))} style={{ width: "100%", accentColor: "#ffc857" }} /></div>
                <div><label style={lblStyle}>摘要</label><textarea value={fd.summary} onChange={(e) => set("summary", e.target.value)} placeholder="一句話說明這顆行星" style={{ ...inputStyle, height: 70, paddingTop: 10 }} /></div>
                <div><label style={lblStyle}>內容 (prompt / skill 全文)</label><textarea value={fd.body} onChange={(e) => set("body", e.target.value)} placeholder="輸入完整內容…" style={{ ...inputStyle, height: 110, paddingTop: 10 }} /></div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={save} style={{ flex: 1, height: 46, background: "#ffc857", color: "#1a1405", border: "none", borderRadius: 8, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: ".08em", cursor: "pointer" }}>{form.isNew ? "✦ 創造" : "✓ 儲存變更"}</button>
              <button onClick={() => setForm(null)} style={{ height: 46, padding: "0 22px", border: "1px solid rgba(95,211,255,.3)", background: "transparent", color: "#8fa0c8", borderRadius: 8, fontFamily: "'Chakra Petch',sans-serif", fontSize: 14, cursor: "pointer" }}>取消</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
