import { useState } from 'react';

export default function TitleBar() {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="titlebar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        WebkitAppRegion: 'drag',
        borderBottom: '1px solid rgba(0,255,136,0.08)',
        background: 'rgba(10,10,15,0.95)',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'linear-gradient(135deg, #00ff88, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            boxShadow: '0 0 12px rgba(0,255,136,0.3)',
          }}
        >
          ⌨️
        </div>
        <span
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize: 13,
            background: 'linear-gradient(135deg, #00ff88, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
          }}
        >
          VIBECODER
        </span>
        <span style={{ fontSize: 10, color: '#444', marginLeft: 4 }}>v2</span>
      </div>

      <div style={{ display: 'flex', gap: 6, WebkitAppRegion: 'no-drag' }}>
        {/* Minimize */}
        <button
          onClick={() => window.electronAPI?.minimizeWindow()}
          onMouseEnter={() => setHovered('min')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            border: 'none',
            background: hovered === 'min' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            transition: 'all 0.15s',
          }}
        >
          ─
        </button>
        {/* Close (hide) */}
        <button
          onClick={() => window.electronAPI?.closeWindow()}
          onMouseEnter={() => setHovered('close')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            border: 'none',
            background: hovered === 'close' ? 'rgba(244,63,94,0.2)' : 'transparent',
            color: hovered === 'close' ? '#f43f5e' : '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            transition: 'all 0.15s',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
