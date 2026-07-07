import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GALAXIES, PLANETS, diffStars } from "../data.js";
import PageTopBar, { ExplorerBadge } from "../components/PageTopBar.jsx";
import { useIdentity } from "../hooks/useIdentity.js";

const PLANET_COUNTS = PLANETS.reduce((acc, p) => {
  acc[p.galaxy] = (acc[p.galaxy] || 0) + 1;
  return acc;
}, {});

const rowBase = { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 11px", borderRadius: 7, cursor: "pointer", transition: "all .15s", fontFamily: "'Noto Sans TC',sans-serif", border: "none", textAlign: "left" };
const typeBase = { flex: 1, height: 34, borderRadius: 7, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: ".06em", transition: "all .15s" };

export default function Explore() {
  const [searchParams] = useSearchParams();
  const { identity } = useIdentity();

  const [query, setQuery] = useState("");
  const [off, setOff] = useState({});
  const [types, setTypes] = useState({ skill: true, prompt: true });
  const [sel, setSel] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const filterRef = useRef({ query, off, types });
  const resetViewRef = useRef(() => {});

  useEffect(() => {
    filterRef.current = { query, off, types };
  }, [query, off, types]);

  useEffect(() => {
    const g = searchParams.get("g");
    if (g && GALAXIES.some((x) => x.id === g)) {
      const initOff = {};
      GALAXIES.forEach((x) => {
        if (x.id !== g) initOff[x.id] = true;
      });
      setOff(initOff);
    }
    // only apply the initial deep-link filter once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    const cam = { x: 0, y: 0, scale: 1 };
    let W = 0, H = 0;

    const nodes = [];
    GALAXIES.forEach((gx, i) => {
      const a = (i / GALAXIES.length) * Math.PI * 2;
      nodes.push({ id: gx.id, kind: "galaxy", name: gx.name, color: gx.color, x: Math.cos(a) * 160, y: Math.sin(a) * 160, vx: 0, vy: 0, r: 20, mass: 6 });
    });
    PLANETS.forEach((p) => {
      const hub = nodes.find((n) => n.id === p.galaxy);
      nodes.push({
        id: p.id, kind: "planet", name: p.name, color: GALAXIES.find((g) => g.id === p.galaxy).color,
        galaxy: p.galaxy, type: p.type, data: p,
        x: hub.x + (Math.random() - 0.5) * 140, y: hub.y + (Math.random() - 0.5) * 140, vx: 0, vy: 0,
        r: 8 + Math.min(6, p.uses / 300), mass: 1.4,
      });
    });
    const edges = PLANETS.map((p) => ({ a: p.galaxy, b: p.id, color: GALAXIES.find((g) => g.id === p.galaxy).color }));
    const nodeById = {};
    nodes.forEach((n) => (nodeById[n.id] = n));

    function active(n) {
      const { off: curOff, types: curTypes, query: curQuery } = filterRef.current;
      if (curOff[n.kind === "galaxy" ? n.id : n.galaxy]) return false;
      if (n.kind === "planet" && !curTypes[n.type]) return false;
      if (curQuery) {
        const q = curQuery.toLowerCase();
        if (n.kind === "planet") return n.name.toLowerCase().includes(q) || (n.data.en || "").toLowerCase().includes(q);
      }
      return true;
    }

    function resize() {
      const w = wrapRef.current;
      const dpr = window.devicePixelRatio || 1;
      W = w.clientWidth;
      H = w.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function toWorld(sx, sy) {
      return { x: (sx - W / 2) / cam.scale + cam.x, y: (sy - H / 2) / cam.scale + cam.y };
    }
    function toScreen(x, y) {
      return { x: (x - cam.x) * cam.scale + W / 2, y: (y - cam.y) * cam.scale + H / 2 };
    }
    function pick(sx, sy) {
      const w = toWorld(sx, sy);
      let best = null, bd = 1e9;
      for (const n of nodes) {
        if (!active(n)) continue;
        const d = Math.hypot(n.x - w.x, n.y - w.y);
        if (d < n.r + 6 && d < bd) { bd = d; best = n; }
      }
      return best;
    }

    let hover = null, drag = null, panning = null;

    function onMouseDown(e) {
      const r = cv.getBoundingClientRect();
      const sx = e.clientX - r.left, sy = e.clientY - r.top;
      const n = pick(sx, sy);
      if (n) drag = { node: n };
      else panning = { sx, sy, cx: cam.x, cy: cam.y };
    }
    function onMouseMove(e) {
      const r = cv.getBoundingClientRect();
      const sx = e.clientX - r.left, sy = e.clientY - r.top;
      if (drag) {
        const w = toWorld(sx, sy);
        drag.node.x = w.x; drag.node.y = w.y; drag.node.vx = 0; drag.node.vy = 0; drag.moved = true;
      } else if (panning) {
        cam.x = panning.cx - (sx - panning.sx) / cam.scale;
        cam.y = panning.cy - (sy - panning.sy) / cam.scale;
      } else {
        hover = pick(sx, sy);
      }
    }
    function onMouseUp() {
      if (drag && !drag.moved) select(drag.node);
      drag = null; panning = null;
    }
    function onWheel(e) {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.12 : 0.89;
      cam.scale = Math.max(0.35, Math.min(3, cam.scale * f));
    }
    function select(n) {
      if (n.kind !== "planet") { setSel(null); return; }
      setSel(n.data);
    }

    cv.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    cv.addEventListener("wheel", onWheel, { passive: false });

    resetViewRef.current = () => { cam.x = 0; cam.y = 0; cam.scale = 1; };

    function draw() {
      const c = ctx;
      c.clearRect(0, 0, W, H);
      const hov = hover;
      const neigh = new Set();
      if (hov) {
        neigh.add(hov.id);
        edges.forEach((e) => { if (e.a === hov.id) neigh.add(e.b); if (e.b === hov.id) neigh.add(e.a); });
      }
      for (const e of edges) {
        const a = nodeById[e.a], b = nodeById[e.b];
        if (!active(a) || !active(b)) continue;
        const pa = toScreen(a.x, a.y), pb = toScreen(b.x, b.y);
        const lit = hov && neigh.has(a.id) && neigh.has(b.id) && (a.id === hov.id || b.id === hov.id);
        c.strokeStyle = lit ? e.color : "rgba(120,150,210,0.16)";
        c.lineWidth = lit ? 1.4 : 0.8;
        c.globalAlpha = hov && !lit ? 0.4 : 1;
        c.beginPath(); c.moveTo(pa.x, pa.y); c.lineTo(pb.x, pb.y); c.stroke(); c.globalAlpha = 1;
      }
      for (const n of nodes) {
        if (!active(n)) continue;
        const p = toScreen(n.x, n.y);
        const r = n.r * cam.scale;
        const dim = hov && !neigh.has(n.id);
        c.globalAlpha = dim ? 0.35 : 1;
        c.shadowColor = n.color;
        c.shadowBlur = hov && neigh.has(n.id) ? 22 : 12;
        c.beginPath(); c.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (n.kind === "galaxy") {
          const g = c.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, r * 0.2, p.x, p.y, r);
          g.addColorStop(0, "#fff"); g.addColorStop(0.4, n.color); g.addColorStop(1, n.color + "55");
          c.fillStyle = g;
        } else {
          c.fillStyle = n.color;
        }
        c.fill(); c.shadowBlur = 0;
        if (n.kind === "galaxy") { c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1; c.stroke(); }
        if (cam.scale > 0.6 || n.kind === "galaxy") {
          c.globalAlpha = dim ? 0.3 : 1;
          c.fillStyle = n.kind === "galaxy" ? "#eaf1ff" : "#aebbdd";
          c.font = n.kind === "galaxy" ? "600 13px 'Chakra Petch'" : "12px 'Noto Sans TC'";
          c.textAlign = "center";
          c.fillText(n.name, p.x, p.y + r + 15);
        }
        c.globalAlpha = 1;
      }
    }

    let raf;
    let lastVisibleCount = -1;
    function tick() {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!active(a)) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (!active(b)) continue;
          let dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy || 0.01;
          const d = Math.sqrt(d2);
          const rep = (a.kind === "galaxy" || b.kind === "galaxy" ? 4200 : 1600) / d2;
          const fx = (dx / d) * rep, fy = (dy / d) * rep;
          a.vx += fx / a.mass; a.vy += fy / a.mass; b.vx -= fx / b.mass; b.vy -= fy / b.mass;
        }
      }
      for (const e of edges) {
        const a = nodeById[e.a], b = nodeById[e.b];
        if (!active(a) || !active(b)) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const rest = 118;
        const f = (d - rest) * 0.012;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx / a.mass; a.vy += fy / a.mass; b.vx -= fx / b.mass; b.vy -= fy / b.mass;
      }
      for (const n of nodes) {
        if (!active(n)) continue;
        n.vx += -n.x * 0.0016; n.vy += -n.y * 0.0016;
        if (drag && drag.node === n) continue;
        n.vx *= 0.86; n.vy *= 0.86; n.x += n.vx; n.y += n.vy;
      }
      draw();
      const vc = nodes.filter((n) => active(n) && n.kind === "planet").length;
      if (vc !== lastVisibleCount) { lastVisibleCount = vc; setVisibleCount(vc); }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      cv.removeEventListener("mousedown", onMouseDown);
      cv.removeEventListener("wheel", onWheel);
    };
  }, []);

  const galaxyRows = GALAXIES.map((g) => {
    const on = !off[g.id];
    return {
      id: g.id, name: g.name, count: PLANET_COUNTS[g.id] || 0, dot: on ? g.color : "#3a4360",
      style: {
        ...rowBase,
        ...(on
          ? { border: `1px solid ${g.color}55`, background: `${g.color}14`, color: "#dce6ff" }
          : { border: "1px solid rgba(95,211,255,.12)", background: "transparent", color: "#5a6788" }),
      },
    };
  });

  function toggleGalaxy(id) {
    setOff((cur) => {
      const next = { ...cur };
      if (next[id]) delete next[id]; else next[id] = true;
      return next;
    });
  }
  function typeStyle(active, color) {
    return { ...typeBase, ...(active ? { border: `1px solid ${color}`, background: `${color}18`, color } : { border: "1px solid rgba(95,211,255,.14)", background: "transparent", color: "#5a6788" }) };
  }

  const selGalaxy = sel ? GALAXIES.find((g) => g.id === sel.galaxy) : null;
  const selColor = selGalaxy ? selGalaxy.color : "#5fd3ff";

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", background: "#05070f", fontFamily: "'Noto Sans TC',sans-serif" }}>
      <PageTopBar
        title="STAR CHART · 星圖圖譜"
        right={(
          <>
            <Link to="/galaxy" style={{ color: "#5fd3ff" }}>◉ 3D 銀河</Link>
            <Link to="/voyage" style={{ color: "#8fa0c8" }}>我的航線</Link>
            <ExplorerBadge name={identity.name} />
          </>
        )}
      />

      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "288px 1fr 300px" }}>
        {/* LEFT filter panel */}
        <div style={{ borderRight: "1px solid rgba(95,211,255,.12)", padding: "22px 20px", overflowY: "auto", background: "rgba(7,11,26,.5)" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#5fd3ff", letterSpacing: ".2em", marginBottom: 14 }}>FILTERS // 篩選</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, border: "1px solid rgba(95,211,255,.24)", borderRadius: 7, padding: "0 12px", marginBottom: 22 }}>
            <span style={{ color: "#5fd3ff" }}>⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋行星…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#dce6ff", fontSize: 13 }} />
          </div>

          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", letterSpacing: ".16em", marginBottom: 10 }}>星系 GALAXIES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {galaxyRows.map((g) => (
              <button key={g.id} onClick={() => toggleGalaxy(g.id)} style={g.style}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: g.dot, boxShadow: `0 0 8px ${g.dot}`, flex: "none" }} />
                <span style={{ flex: 1, textAlign: "left", fontSize: 13 }}>{g.name}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0" }}>{g.count}</span>
              </button>
            ))}
          </div>

          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", letterSpacing: ".16em", marginBottom: 10 }}>類型 TYPE</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <button onClick={() => setTypes((t) => ({ ...t, skill: !t.skill }))} style={typeStyle(types.skill, "#5fd3ff")}>skill</button>
            <button onClick={() => setTypes((t) => ({ ...t, prompt: !t.prompt }))} style={typeStyle(types.prompt, "#a98bff")}>prompt</button>
          </div>

          <div style={{ borderTop: "1px solid rgba(95,211,255,.12)", paddingTop: 18 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", letterSpacing: ".16em", marginBottom: 10 }}>檢視 VIEW</div>
            <button onClick={() => resetViewRef.current()} style={{ width: "100%", height: 38, border: "1px solid rgba(95,211,255,.24)", background: "transparent", borderRadius: 7, color: "#8fa0c8", fontFamily: "'Chakra Petch',sans-serif", fontSize: 12, letterSpacing: ".1em", cursor: "pointer" }}>⟳ 重置視角</button>
            <p style={{ color: "#5a6788", fontSize: 11, lineHeight: 1.7, margin: "14px 0 0" }}>拖曳節點重新排列 · 滾輪縮放 · 拖曳空白處平移 · 點擊行星查看詳情</p>
          </div>
        </div>

        {/* CENTER graph */}
        <div ref={wrapRef} style={{ position: "relative", overflow: "hidden", background: "radial-gradient(900px 700px at 50% 45%,#0b1330 0%,#070a1c 60%,#05070f 100%)" }}>
          <canvas ref={canvasRef} style={{ display: "block", cursor: "grab" }} />
          <div style={{ position: "absolute", top: 16, left: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#5a6788", pointerEvents: "none" }}>NODES: {visibleCount} · GRAPH VIEW</div>
          <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#8fa0c8", pointerEvents: "none" }}>
            <span><span style={{ color: "#a98bff" }}>●</span> 寫作</span>
            <span><span style={{ color: "#5fd3ff" }}>●</span> 程式</span>
            <span><span style={{ color: "#ffc857" }}>●</span> 行銷</span>
          </div>
        </div>

        {/* RIGHT detail */}
        <div style={{ borderLeft: "1px solid rgba(95,211,255,.12)", padding: "22px 20px", overflowY: "auto", background: "rgba(7,11,26,.5)" }}>
          {sel ? (
            <div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6b7aa0", letterSpacing: ".16em", marginBottom: 14 }}>{sel.coord} · {sel.type.toUpperCase()}</div>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #fff, ${selColor} 55%, ${selColor}44 100%)`, boxShadow: `0 0 34px ${selColor}88`, marginBottom: 16 }} />
              <h2 style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#eaf1ff", fontSize: 20, margin: "0 0 2px" }}>{sel.name}</h2>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: selColor, letterSpacing: ".08em", marginBottom: 16 }}>{sel.en}</div>
              <p style={{ color: "#aebbdd", fontSize: 13.5, lineHeight: 1.8, margin: "0 0 18px" }}>{sel.summary}</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <div style={{ flex: 1, border: "1px solid rgba(95,211,255,.18)", borderRadius: 7, padding: 10 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0" }}>難度</div>
                  <div style={{ color: "#dce6ff", fontFamily: "'Chakra Petch',sans-serif", fontSize: 15 }}>{diffStars(sel.difficulty)}</div>
                </div>
                <div style={{ flex: 1, border: "1px solid rgba(95,211,255,.18)", borderRadius: 7, padding: 10 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6b7aa0" }}>航行次數</div>
                  <div style={{ color: "#dce6ff", fontFamily: "'Chakra Petch',sans-serif", fontSize: 15 }}>{sel.uses}</div>
                </div>
              </div>
              <Link to={`/planet/${sel.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 46, marginTop: 16, background: "#5fd3ff", color: "#04050c", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 14, borderRadius: 8, letterSpacing: ".08em", boxShadow: "0 0 24px rgba(95,211,255,.3)" }}>▶ 登陸此行星</Link>
            </div>
          ) : (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", color: "#5a6788", paddingTop: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.5 }}>◎</div>
              <div style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#8fa0c8", fontSize: 14, letterSpacing: ".06em" }}>點選一顆行星</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, marginTop: 8 }}>選取圖譜上的節點<br />檢視該 skill / prompt 詳情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
