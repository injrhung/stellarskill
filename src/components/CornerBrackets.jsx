const CORNER_STYLE = {
  tl: (size, color, offset) => ({ position: "absolute", top: offset, left: offset, width: size, height: size, borderLeft: `2px solid ${color}`, borderTop: `2px solid ${color}` }),
  tr: (size, color, offset) => ({ position: "absolute", top: offset, right: offset, width: size, height: size, borderRight: `2px solid ${color}`, borderTop: `2px solid ${color}` }),
  bl: (size, color, offset) => ({ position: "absolute", bottom: offset, left: offset, width: size, height: size, borderLeft: `2px solid ${color}`, borderBottom: `2px solid ${color}` }),
  br: (size, color, offset) => ({ position: "absolute", bottom: offset, right: offset, width: size, height: size, borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` }),
};

/** HUD-style corner brackets, decorating viewport panels. */
export default function CornerBrackets({ corners = ["tl", "tr", "bl", "br"], color = "rgba(95,211,255,.4)", size = 34, offset = 26 }) {
  return corners.map((c) => <div key={c} style={CORNER_STYLE[c](size, color, offset)} />);
}
