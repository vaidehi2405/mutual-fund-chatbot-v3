import React, { useState, useEffect } from "react";
import ChatInterface from './components/ChatInterface';
import { Bot, Search, Bell, ShoppingCart, ChevronRight, Menu, X } from "lucide-react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const G = {
  emerald: "#00D09C",
  emeraldDark: "#00b386",
  emeraldLight: "#EAF9F5",
  text: "#44475b",
  textDark: "#1a1a2e",
  muted: "#6b7280",
  border: "#e8eaed",
  surface: "#f7f8fa",
  white: "#ffffff",
  green: "#00b386",
  blueBg: "#eef6ff",
};

// ─── Breakpoint hook ──────────────────────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1440);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: 'Inter', sans-serif; background: #fff; }
  a { text-decoration: none; }
  button { font-family: 'Inter', sans-serif; }

  /* ── Nav search ── */
  .search-wrap { position: relative; display: flex; align-items: center; }
  .search-input {
    width: 260px; padding: 8px 44px 8px 36px;
    border: 1px solid ${G.border}; border-radius: 8px;
    font-size: 13px; color: ${G.text}; background: #fff;
    outline: none; font-family: 'Inter', sans-serif;
    transition: border-color .15s;
  }
  .search-input:focus { border-color: #aaa; }
  .search-icon { position: absolute; left: 10px; color: #9ca3af; pointer-events: none; }
  .search-kbd {
    position: absolute; right: 10px;
    font-size: 11px; color: #9ca3af;
    background: #f3f4f6; border: 1px solid #e5e7eb;
    border-radius: 4px; padding: 1px 5px; pointer-events: none;
    font-family: 'Inter', sans-serif;
  }

  /* ── Fund card ── */
  .fund-card {
    background: #fff; border: 1px solid ${G.border};
    border-radius: 12px; padding: 20px 20px 18px;
    cursor: pointer; transition: box-shadow .18s; min-width: 0;
    display: flex; flex-direction: column; gap: 0;
  }
  .fund-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.09); }
  .fund-logo {
    width: 52px; height: 52px; border-radius: 10px;
    object-fit: contain; margin-bottom: 14px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }
  .fund-name {
    font-size: 14px; font-weight: 500; color: ${G.textDark};
    line-height: 1.45; flex: 1; margin-bottom: 16px;
  }
  .fund-return {
    font-size: 15px; font-weight: 600; color: ${G.green};
    display: flex; align-items: center; justify-content: space-between;
  }
  .fund-period { font-size: 13px; color: ${G.muted}; font-weight: 400; }

  /* ── Collection tile ── */
  .coll-tile {
    display: flex; flex-direction: column; align-items: center;
    gap: 10px; cursor: pointer;
  }
  .coll-box {
    border-radius: 16px; background: ${G.surface};
    display: flex; align-items: center; justify-content: center;
    transition: box-shadow .15s;
    overflow: hidden;
  }
  .coll-box:hover { box-shadow: 0 2px 12px rgba(0,0,0,.1); }
  .coll-label { font-size: 13px; font-weight: 500; color: ${G.textDark}; text-align: center; }

  /* ── Sidebar card ── */
  .side-card {
    background: #fff; border: 1px solid ${G.border};
    border-radius: 16px; overflow: hidden;
  }

  /* ── Tool row ── */
  .tool-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 0; border-bottom: 1px solid #f3f4f6; cursor: pointer;
  }
  .tool-row:last-child { border-bottom: none; }
  .tool-row:hover .tool-label { color: ${G.emerald}; }

  /* ── Tab button ── */
  .tab-btn {
    padding: 12px 0; margin-right: 28px;
    font-size: 14px; font-weight: 500; cursor: pointer;
    border: none; background: none; color: ${G.muted};
    border-bottom: 2px solid transparent;
    transition: color .14s; white-space: nowrap;
    font-family: 'Inter', sans-serif;
  }
  .tab-btn.active { color: ${G.textDark}; font-weight: 600; border-bottom: 2px solid ${G.textDark}; }
  .tab-btn:hover:not(.active) { color: ${G.textDark}; }

  /* ── Setup button ── */
  .setup-btn {
    width: 100%; padding: 13px; background: ${G.emerald};
    color: #fff; border: none; border-radius: 8px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    letter-spacing: 0.8px; font-family: 'Inter', sans-serif;
    transition: background .15s;
  }
  .setup-btn:hover { background: ${G.emeraldDark}; }

  /* ── Footer ── */
  .footer-link {
    font-size: 13px; color: ${G.text}; font-weight: 400;
    transition: color .12s; cursor: pointer;
  }
  .footer-link:hover { color: ${G.emerald}; }

  /* ── Responsive ── */
  .main-wrap {
    max-width: 1400px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 340px;
    gap: 28px; padding: 28px 32px;
  }
  .fund-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .coll-row  { display: flex; gap: 16px; flex-wrap: nowrap; }
  .nfo-grid  { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .footer-cols { display: grid; grid-template-columns: 240px 1fr 1fr 1fr; gap: 48px; }
  .seo-cols    { display: grid; grid-template-columns: repeat(5,1fr); gap: 4px 0; }

  @media (max-width: 1100px) {
    .main-wrap { grid-template-columns: 1fr 300px; padding: 20px 24px; gap: 20px; }
    .fund-grid { grid-template-columns: repeat(2,1fr); }
    .nfo-grid  { grid-template-columns: repeat(2,1fr); }
    .footer-cols { grid-template-columns: 1fr 1fr; gap: 32px; }
    .seo-cols    { grid-template-columns: repeat(3,1fr); }
  }
  @media (max-width: 768px) {
    .main-wrap { grid-template-columns: 1fr; padding: 16px; gap: 16px; }
    .fund-grid { grid-template-columns: repeat(2,1fr); gap: 12px; }
    .nfo-grid  { grid-template-columns: repeat(2,1fr); gap: 12px; }
    .coll-row  { flex-wrap: wrap; gap: 12px; }
    .footer-cols { grid-template-columns: 1fr 1fr; gap: 24px; }
    .seo-cols    { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 480px) {
    .fund-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .nfo-grid  { grid-template-columns: 1fr 1fr; gap: 10px; }
    .footer-cols { grid-template-columns: 1fr; }
    .seo-cols    { grid-template-columns: repeat(2,1fr); }
  }
`;

// ─── Illustrated SVG icons for collections (matching Groww's teal isometric style) ─
const CollectionIcons: Record<string, React.ReactNode> = {
  "High return": (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="32" width="10" height="24" rx="2" fill="#00D09C" opacity=".7" />
      <rect x="22" y="22" width="10" height="34" rx="2" fill="#00D09C" opacity=".85" />
      <rect x="36" y="14" width="10" height="42" rx="2" fill="#00D09C" />
      <polyline points="10,30 24,20 38,12 54,6" stroke="#00b386" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="54" cy="6" r="3" fill="#00b386" />
    </svg>
  ),
  "Gold & Silver": (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="10" y="28" width="18" height="26" rx="3" fill="#f59e0b" opacity=".8" />
      <rect x="14" y="22" width="10" height="8" rx="2" fill="#f59e0b" />
      <rect x="36" y="28" width="18" height="26" rx="3" fill="#9ca3af" opacity=".8" />
      <rect x="40" y="22" width="10" height="8" rx="2" fill="#9ca3af" />
      <circle cx="19" cy="19" r="5" fill="#fbbf24" />
      <circle cx="45" cy="19" r="5" fill="#d1d5db" />
    </svg>
  ),
  "5 Star Funds": (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      {[32, 14, 50, 20, 44].map((cx, i) => {
        const cys = [10, 26, 26, 48, 48];
        return <polygon key={i} points={`${cx},${cys[i] - 8} ${cx + 3},${cys[i] - 2} ${cx + 9},${cys[i] - 2} ${cx + 4},${cys[i] + 2} ${cx + 6},${cys[i] + 8} ${cx},${cys[i] + 4} ${cx - 6},${cys[i] + 8} ${cx - 4},${cys[i] + 2} ${cx - 9},${cys[i] - 2} ${cx - 3},${cys[i] - 2}`} fill="#00D09C" opacity={i === 0 ? "1" : "0.6"} />;
      })}
    </svg>
  ),
  "Large Cap": (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="18" y="18" width="28" height="36" rx="3" fill="#00D09C" opacity=".2" />
      <rect x="22" y="22" width="20" height="28" rx="2" fill="#00D09C" opacity=".5" />
      <rect x="26" y="10" width="12" height="8" rx="2" fill="#00D09C" />
      <rect x="24" y="38" width="5" height="8" rx="1" fill="#fff" opacity=".7" />
      <rect x="35" y="38" width="5" height="8" rx="1" fill="#fff" opacity=".7" />
      <rect x="29" y="30" width="6" height="6" rx="1" fill="#fff" opacity=".7" />
    </svg>
  ),
  "Mid Cap": (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="10" y="30" width="18" height="24" rx="3" fill="#00D09C" opacity=".5" />
      <rect x="32" y="20" width="22" height="34" rx="3" fill="#00D09C" opacity=".8" />
      <rect x="34" y="10" width="10" height="12" rx="2" fill="#00D09C" />
      <rect x="14" y="38" width="4" height="6" rx="1" fill="#fff" opacity=".6" />
      <rect x="36" y="32" width="4" height="6" rx="1" fill="#fff" opacity=".6" />
      <rect x="44" y="32" width="4" height="6" rx="1" fill="#fff" opacity=".6" />
    </svg>
  ),
  "Small Cap": (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="42" width="14" height="12" rx="2" fill="#00D09C" opacity=".4" />
      <rect x="26" y="34" width="14" height="20" rx="2" fill="#00D09C" opacity=".65" />
      <rect x="44" y="26" width="14" height="28" rx="2" fill="#00D09C" opacity=".9" />
      <polyline points="15,40 33,32 51,24" stroke="#00b386" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="3 2" />
    </svg>
  ),
};

// ─── Fund logo SVGs (matching real Groww logos closely) ──────────────────────
const FundLogos: Record<string, React.ReactNode> = {
  nippon: (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ borderRadius: 10 }}>
      <rect width="52" height="52" fill="#c8102e" />
      <rect x="4" y="4" width="44" height="44" rx="4" fill="#c8102e" />
      <path d="M10 10 L26 26 L42 10" stroke="white" strokeWidth="4" fill="none" />
      <path d="M10 42 L26 26 L42 42" stroke="white" strokeWidth="4" fill="none" />
    </svg>
  ),
  bandhan: (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ borderRadius: 10 }}>
      <rect width="52" height="52" rx="10" fill="#1a1a2e" />
      <circle cx="26" cy="22" r="8" fill="none" stroke="#ff6b35" strokeWidth="3" />
      <path d="M18 34 Q26 28 34 34" stroke="#ff6b35" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="22" r="3" fill="#ff6b35" />
    </svg>
  ),
  hdfc: (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ borderRadius: 10 }}>
      <rect width="52" height="52" rx="10" fill="#fff" stroke="#e5e7eb" />
      <rect x="8" y="8" width="36" height="36" rx="4" fill="none" stroke="#c8102e" strokeWidth="4" />
      <rect x="16" y="16" width="20" height="20" rx="2" fill="none" stroke="#c8102e" strokeWidth="3" />
      <rect x="20" y="20" width="12" height="12" rx="1" fill="#c8102e" />
    </svg>
  ),
  parag: (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ borderRadius: 10 }}>
      <rect width="52" height="52" rx="10" fill="#f0fdf4" />
      <ellipse cx="26" cy="28" rx="12" ry="8" fill="#22c55e" opacity=".3" />
      <path d="M20 32 Q26 16 32 32" fill="#22c55e" />
      <circle cx="26" cy="18" r="4" fill="#16a34a" />
      <path d="M22 34 L30 34" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

// ─── Components ───────────────────────────────────────────────────────────────

interface FundCardProps {
  logoKey: string; name: string;
  ret?: string; period?: string;
  badge?: string; date?: string; dateLabel?: string;
}
const FundCard: React.FC<FundCardProps> = ({ logoKey, name, ret, period, badge, date, dateLabel }) => (
  <div className="fund-card">
    {badge && (
      <span style={{
        display: "inline-block", marginBottom: 10,
        background: "#dbeafe", color: "#1d4ed8",
        fontSize: 10, fontWeight: 700, padding: "2px 7px",
        borderRadius: 4, letterSpacing: 0.3,
      }}>{badge}</span>
    )}
    <div className="fund-logo">{FundLogos[logoKey]}</div>
    <div className="fund-name">{name}</div>
    {ret ? (
      <div className="fund-return">
        <span>{ret}</span>
        <span className="fund-period">{period}</span>
      </div>
    ) : (
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: G.muted }}>
        <span style={{ color: date !== "--" ? G.textDark : G.muted, fontWeight: date !== "--" ? 600 : 400 }}>{date}</span>
        <span>{dateLabel}</span>
      </div>
    )}
  </div>
);

const CollTile: React.FC<{ label: string; size: number }> = ({ label, size }) => (
  <div className="coll-tile">
    <div className="coll-box" style={{ width: size, height: size }}>
      {CollectionIcons[label]}
    </div>
    <span className="coll-label">{label}</span>
  </div>
);

const ToolRow: React.FC<{ icon: string; label: string; badge?: string }> = ({ icon, label, badge }) => (
  <div className="tool-row">
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
      <span className="tool-label" style={{ fontSize: 13, fontWeight: 500, color: G.text, transition: "color .12s" }}>{label}</span>
    </div>
    {badge && (
      <span style={{
        background: G.emeraldLight, color: G.emeraldDark,
        fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20,
      }}>{badge}</span>
    )}
  </div>
);

const FooterColEl: React.FC<{ title: string; links: string[] }> = ({ title, links }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
    {title && <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 1.1,
      color: G.muted, textTransform: "uppercase" as const, marginBottom: 2,
    }}>{title}</span>}
    {links.map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
  </div>
);

// ─── Sidebar "Attention Required" illustration ────────────────────────────────
const AttentionIllustration = () => (
  <div style={{
    background: "linear-gradient(160deg, #d6eeff 0%, #c5e8ff 60%, #b8d4f0 100%)",
    padding: "28px 20px 20px", position: "relative", minHeight: 180,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <svg width="240" height="140" viewBox="0 0 240 140" fill="none">
      {/* Laptop base */}
      <rect x="40" y="80" width="160" height="10" rx="5" fill="#a0c4e8" opacity=".6" />
      <rect x="55" y="25" width="130" height="58" rx="6" fill="#cce4f8" />
      <rect x="60" y="29" width="120" height="50" rx="4" fill="#e8f4ff" />
      {/* Screen content - fingerprint scanner */}
      <rect x="75" y="34" width="90" height="40" rx="3" fill="#4ade80" opacity=".15" />
      <rect x="78" y="37" width="84" height="34" rx="2" fill="#22c55e" opacity=".1" />
      {/* Fingerprint */}
      <g transform="translate(120,54) scale(0.9)">
        <circle cx="0" cy="0" r="14" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity=".5" />
        <circle cx="0" cy="0" r="10" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity=".6" />
        <circle cx="0" cy="0" r="6" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity=".7" />
        <circle cx="0" cy="0" r="2" fill="#22c55e" opacity=".8" />
      </g>
      {/* Warning triangle */}
      <polygon points="112,66 120,52 128,66" fill="#f59e0b" opacity=".9" />
      <line x1="120" y1="57" x2="120" y2="62" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="120" cy="64" r="0.8" fill="white" />
      {/* Robot/person icon at top */}
      <circle cx="180" cy="18" r="10" fill="#94a3b8" opacity=".5" />
      <circle cx="180" cy="13" r="5" fill="#64748b" opacity=".7" />
      {/* Wires */}
      <path d="M170 25 Q160 35 155 45" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
      <path d="M190 22 Q200 32 198 50" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
      {/* Keyboard */}
      {[65, 80, 95, 110, 125, 140, 155].map((x, i) => (
        <rect key={i} x={x} y="84" width="10" height="5" rx="1.5" fill="#90bcd8" opacity=".5" />
      ))}
      {[70, 88, 108, 128, 148].map((x, i) => (
        <rect key={i} x={x} y="91" width="12" height="5" rx="1.5" fill="#90bcd8" opacity=".4" />
      ))}
    </svg>
  </div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Explore");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const w = useWidth();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1100;

  const collSize = isMobile ? 80 : isTablet ? 88 : 96;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: G.white, color: G.text, minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* ════════════════════════════════ NAVBAR ════════════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,.97)", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${G.border}`,
      }}>
        {/* Top row */}
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          padding: "0 32px", height: 60,
          display: "flex", alignItems: "center", gap: 0,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 36, flexShrink: 0 }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00D09C" />
                  <stop offset="50%" stopColor="#5865f2" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="16" fill="url(#lg1)" />
            </svg>
          </div>

          {/* Nav links */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 28, marginRight: "auto" }}>
              {[["Stocks", false], ["F&O", false], ["Mutual Funds", true]].map(([label, active]) => (
                <a key={label as string} href="#" style={{
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  color: active ? G.textDark : G.muted,
                  borderBottom: active ? `2px solid ${G.textDark}` : "none",
                  paddingBottom: active ? 2 : 0,
                }}>{label}</a>
              ))}
            </div>
          )}

          {/* Right: search + icons */}
          <div style={{
            marginLeft: isMobile ? "auto" : 0,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            {!isMobile && (
              <div className="search-wrap">
                <Search size={15} className="search-icon" />
                <input className="search-input" placeholder="Search Groww...." />
                <span className="search-kbd">Ctrl+K</span>
              </div>
            )}

            {isMobile && (
              <button onClick={() => setMobileMenu(v => !v)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: G.text, display: "flex", alignItems: "center",
              }}>
                {mobileMenu ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}

            <Bell size={20} style={{ color: G.text, cursor: "pointer", strokeWidth: 1.5 }} />
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#7c6f5e",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
              flexShrink: 0,
            }}>V</div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobile && mobileMenu && (
          <div style={{
            padding: "12px 20px 16px",
            borderTop: `1px solid ${G.border}`,
            background: G.white,
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div className="search-wrap" style={{ marginBottom: 8 }}>
              <Search size={14} className="search-icon" />
              <input className="search-input" placeholder="Search Groww...." style={{ width: "100%" }} />
            </div>
            {["Stocks", "F&O", "Mutual Funds"].map(l => (
              <a key={l} href="#" style={{
                padding: "10px 0", fontSize: 14, fontWeight: 500,
                color: G.text, borderBottom: `1px solid ${G.border}`,
              }}>{l}</a>
            ))}
          </div>
        )}

        {/* Sub-tabs row */}
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          overflowX: "auto",
        }}>
          <div style={{ display: "flex", flexShrink: 0 }}>
            {["Explore", "Dashboard", "SIPs", "Watchlist"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`tab-btn${activeTab === t ? " active" : ""}`}>
                {t}
              </button>
            ))}
          </div>
          {!isMobile && (
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", border: `1px solid ${G.border}`,
              borderRadius: 8, background: G.white, fontSize: 13,
              fontWeight: 500, cursor: "pointer", color: G.text,
              flexShrink: 0, fontFamily: "Inter, sans-serif",
            }}>
              <ShoppingCart size={14} /> Cart
            </button>
          )}
        </div>
      </nav>

      {/* ════════════════════════════════ MAIN ══════════════════════════ */}
      <div className="main-wrap">

        {/* ── LEFT ── */}
        <div style={{ minWidth: 0 }}>

          {/* Popular Funds */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: G.textDark, marginBottom: 20 }}>
              Popular Funds
            </h2>
            <div className="fund-grid">
              <FundCard logoKey="nippon" name="Nippon India Taiwan Equity Fund" ret="+58.64%" period="3Y" />
              <FundCard logoKey="bandhan" name="Bandhan Small Cap Fund" ret="+32.47%" period="3Y" />
              <FundCard logoKey="hdfc" name="HDFC Mid Cap Fund" ret="+25.45%" period="3Y" />
              <FundCard logoKey="parag" name="Parag Parikh Flexi Cap Fund" ret="+18.97%" period="3Y" />
            </div>
            <a href="#" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              marginTop: 16, fontSize: 14, fontWeight: 600, color: G.emerald,
            }}>
              All Mutual Funds <ChevronRight size={15} />
            </a>
          </section>

          {/* Collections */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: G.textDark, marginBottom: 20 }}>
              Collections
            </h2>
            <div className="coll-row">
              {["High return", "Gold & Silver", "5 Star Funds", "Large Cap", "Mid Cap", "Small Cap"].map(l => (
                <CollTile key={l} label={l} size={collSize} />
              ))}
            </div>
          </section>

          {/* Funds by Groww */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: G.textDark, marginBottom: 20 }}>
              Funds by Groww
            </h2>
            <div className="nfo-grid">
              <FundCard logoKey="nippon" name="Groww Arbitrage Fund" badge="NFO" date="22 Apr" dateLabel="Ends in 3 days" />
              <FundCard logoKey="bandhan" name="Groww Silver ETF FoF Direct Growth" date="--" dateLabel="11M Old" />
              <FundCard logoKey="hdfc" name="Groww Gold ETF FOF Direct Growth" date="--" dateLabel="NA" />
              <FundCard logoKey="parag" name="Groww Multicap Fund Direct Growth" date="--" dateLabel="NA" />
            </div>
            <a href="#" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              marginTop: 16, fontSize: 14, fontWeight: 600, color: G.emerald,
            }}>
              View all <ChevronRight size={15} />
            </a>
          </section>
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          

          {/* Products and Tools */}
          <div className="side-card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: G.textDark, marginBottom: 8 }}>
              Products and Tools
            </h3>
            <ToolRow icon="📡" label="NFO Live" badge="8 open" />
            <ToolRow icon="📥" label="Import funds" />
            <ToolRow icon="⚖️" label="Compare funds" />
            <ToolRow icon="🧮" label="SIP Calculator" />
            <ToolRow icon="🔍" label="Mutual funds screener" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════ FOOTER ════════════════════════ */}
      <footer style={{ background: "#f9fafb", borderTop: `1px solid ${G.border}`, marginTop: 40 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 32px 28px" }}>
          <div className="footer-cols">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <svg width="26" height="26" viewBox="0 0 26 26">
                  <defs>
                    <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00D09C" />
                      <stop offset="50%" stopColor="#5865f2" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <circle cx="13" cy="13" r="13" fill="url(#lg2)" />
                </svg>
                <span style={{ fontWeight: 800, fontSize: 16, color: G.textDark }}>Groww</span>
              </div>
              <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.75, marginBottom: 14 }}>
                Vaishnavi Tech Park, South Tower, 3rd Floor<br />
                Sarjapur Main Road, Bellandur, Bengaluru – 560083<br />
                Karnataka
              </p>
              <a href="#" style={{ fontSize: 12, color: G.text, fontWeight: 500, textDecoration: "underline", display: "block", marginBottom: 12 }}>
                Contact Us
              </a>
              <p style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>Download the App</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {["🍎", "▶"].map(ic => (
                  <div key={ic} style={{
                    width: 30, height: 30, background: G.border, borderRadius: 7,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, cursor: "pointer",
                  }}>{ic}</div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                {["𝕏", "📸", "f", "in", "▶"].map(ic => (
                  <span key={ic} style={{ fontSize: 15, color: G.muted, cursor: "pointer" }}>{ic}</span>
                ))}
              </div>
            </div>
            <FooterColEl title="Groww" links={["About Us", "Pricing", "Blog", "Media & Press", "Careers", "Help & Support", "Trust & Safety", "Investor Relations"]} />
            <FooterColEl title="Products" links={["Stocks", "F&O", "MTF", "ETF", "IPO", "Mutual Funds", "Commodities", "Groww Terminal"]} />
            <FooterColEl title="" links={["915 Terminal", "Stock Screens", "Algo Trading", "Groww Charts", "Groww Digest", "Demat Account", "Groww AMC", "PMS"]} />
          </div>

          <div style={{
            marginTop: 28, paddingTop: 16, borderTop: `1px solid ${G.border}`,
            display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
          }}>
            <span style={{ fontSize: 12, color: G.muted }}>© 2016–2026 Groww. All rights reserved.</span>
            <span style={{ fontSize: 12, color: G.muted }}>Version: 7.5.3</span>
          </div>

          {/* SEO links */}
          <div style={{ marginTop: 20, borderTop: `1px solid ${G.border}`, paddingTop: 16 }}>
            <div style={{ display: "flex", gap: 20, marginBottom: 14, overflowX: "auto" as const, flexWrap: "wrap" }}>
              {["Share Market", "Indices", "F&O", "Mutual Funds", "ETFs", "Funds By Groww", "Calculators", "IPO", "Miscellaneous"].map((t, i) => (
                <a key={t} href="#" style={{
                  fontSize: 12, fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? G.textDark : G.muted,
                  borderBottom: i === 0 ? `2px solid ${G.textDark}` : "none",
                  paddingBottom: 3, whiteSpace: "nowrap" as const,
                }}>{t}</a>
              ))}
            </div>
            <div className="seo-cols">
              {[
                "Top Gainers Stocks", "Top Losers Stocks", "Most Traded Stocks", "Stocks Feed", "FII DII Activity",
                "52 Weeks High Stocks", "52 Weeks Low Stocks", "Stocks Market Calender", "Suzlon Energy", "IRFC",
                "Tata Motors", "IREDA", "Tata Steel", "Zomato (Eternal)", "Bharat Electronics",
                "NHPC", "State Bank of India", "Tata Power", "Yes Bank", "HDFC Bank",
                "ITC", "Adani Power", "Bharat Heavy Electricals", "Infosys", "Vedanta",
                "Wipro", "CDSL", "Indian Oil Corporation", "NBCC", "Reliance Power",
              ].map(l => (
                <a key={l} href="#" className="footer-link" style={{ fontSize: 11, display: "block", padding: "3px 0" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* FAB */}
      {!isChatOpen && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200 }}>
          <button onClick={() => setIsChatOpen(true)} style={{
            width: 52, height: 52, borderRadius: "50%", background: G.emerald,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(0,208,156,.4)",
            transition: "transform .15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
            <Bot color="#fff" size={22} />
          </button>
        </div>
      )}
      {/* 5. Chat Interface Modal */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 z-[1001] w-full max-w-[420px] animate-in slide-in-from-bottom-8 slide-in-from-right-4 fade-in duration-500 zoom-in-95">
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>


  );
};

export default App;