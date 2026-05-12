import { useEffect, useState } from 'react';

export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState(0);
  // phase 0: hidden, 1: cap drops, 2: CAPZYY reveals, 3: tagline letters, 4: counter

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1500);
    const t4 = setTimeout(() => setPhase(4), 2000);

    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 8 + 4;
      if (v >= 100) {
        v = 100;
        setPct(100);
        clearInterval(id);
        setTimeout(() => setDone(true), 900);
      } else {
        setPct(Math.floor(v));
      }
    }, 120);

    return () => {
      clearInterval(id);
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, []);

  const tagline = 'CRAZY FOR CAPS'.split('');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

        @keyframes capFall {
          0%   { opacity: 0; transform: translateY(-60px) rotate(-8deg) scale(0.8); }
          55%  { transform: translateY(8px) rotate(1deg) scale(1.03); }
          75%  { transform: translateY(-4px) rotate(0deg) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes wordReveal {
          0%   { opacity: 0; clip-path: inset(0 100% 0 0); letter-spacing: 0.3em; }
          100% { opacity: 1; clip-path: inset(0 0% 0 0); letter-spacing: 0.06em; }
        }
        @keyframes letterRise {
          0%   { opacity: 0; transform: translateY(16px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes glowPulse {
          0%,100% { text-shadow: 0 0 10px rgba(200,241,53,0.4), 0 0 24px rgba(200,241,53,0.15); }
          50%      { text-shadow: 0 0 20px rgba(200,241,53,0.7), 0 0 48px rgba(200,241,53,0.3); }
        }
        @keyframes capGlow {
          0%,100% { filter: drop-shadow(0 0 6px rgba(200,241,53,0.35)); }
          50%      { filter: drop-shadow(0 0 18px rgba(200,241,53,0.65)); }
        }
        @keyframes counterBlink {
          0%,100% { opacity: 0.9; }
          50%      { opacity: 0.5; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-120px); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fadeSlideUp {
          0% { opacity:0; transform: translateY(20px); }
          100% { opacity:1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transform: done ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.75s cubic-bezier(0.76,0,0.24,1)',
          pointerEvents: done ? 'none' : 'auto',
          overflow: 'hidden',
        }}
        aria-hidden={done}
      >
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(200,241,53,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,53,0.018) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }} />

        {/* Scanline sweep */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '120px',
            background: 'linear-gradient(to bottom, transparent, rgba(200,241,53,0.028), transparent)',
            animation: 'scanline 5s linear infinite',
          }} />
        </div>

        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(200,241,53,0.06) 0%, transparent 68%)',
          borderRadius: '50%',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
        }} />

        {/* Logo block */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* SVG Cap — faithful recreation of the original */}
          <div style={{
            animation: phase >= 1 ? 'capFall 0.7s cubic-bezier(0.34,1.4,0.64,1) forwards, capGlow 3s ease-in-out 1s infinite' : 'none',
            opacity: 0,
            marginBottom: '-6px',
          }}>
            <svg
              width="220" height="160"
              viewBox="0 0 220 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Button/knob on top */}
              <ellipse cx="110" cy="18" rx="7" ry="8" fill="#C8F135"/>

              {/* Crown — left panel (flatter, wider brim side) */}
              <path
                d="M110 24
                   C 88 24, 62 34, 44 54
                   C 36 63, 32 72, 32 80
                   L 110 80 Z"
                fill="#C8F135"
              />

              {/* Crown — right panel (taller, rounder) */}
              <path
                d="M110 24
                   C 130 24, 152 30, 166 46
                   C 176 58, 178 70, 178 80
                   L 110 80 Z"
                fill="#C8F135"
              />

              {/* Seam line down center of crown */}
              <line x1="110" y1="24" x2="110" y2="80" stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>

              {/* Band / sweatband line */}
              <rect x="32" y="78" width="146" height="7" rx="2" fill="rgba(0,0,0,0.12)"/>

              {/* White highlight seam on band */}
              <line x1="38" y1="81" x2="172" y2="81" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5"/>

              {/* Brim — sweeping wide to the left */}
              <path
                d="M32 84
                   C 20 86, 4 90, 2 100
                   C 0 108, 8 114, 20 116
                   C 40 120, 72 122, 100 122
                   C 110 122, 116 121, 116 121
                   L 110 84 Z"
                fill="#C8F135"
              />

              {/* Brim right side merging into body */}
              <path
                d="M110 84
                   L 116 121
                   C 122 120, 130 118, 135 115
                   C 150 108, 152 98, 145 90
                   C 140 84, 132 82, 120 82
                   L 110 84 Z"
                fill="#C8F135"
              />

              {/* Brim edge highlight (the white stripe visible in original) */}
              <path
                d="M6 104 C 20 110, 55 116, 100 118 C 110 118, 116 117, 130 114"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* CAPZYY — western slab serif */}
          <div
            style={{
              fontFamily: "'Rye', serif",
              fontSize: 'clamp(58px, 14vw, 88px)',
              color: '#C8F135',
              letterSpacing: '0.06em',
              lineHeight: 1,
              opacity: 0,
              animation: phase >= 2
                ? 'wordReveal 0.7s cubic-bezier(0.22,1,0.36,1) forwards, glowPulse 3s ease-in-out 1s infinite'
                : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            CAPZYY
          </div>

          {/* CRAZY FOR CAPS — letter by letter */}
          <div style={{
            display: 'flex',
            gap: '0px',
            marginTop: '8px',
            fontFamily: "'Rye', serif",
            fontSize: 'clamp(12px, 2.5vw, 16px)',
            letterSpacing: '0.28em',
            color: '#C8F135',
          }}>
            {tagline.map((char, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  opacity: 0,
                  animation: phase >= 3
                    ? `letterRise 0.4s ease forwards ${i * 55}ms, glowPulse 3.5s ease-in-out ${i * 90}ms infinite`
                    : 'none',
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Counter */}
          <div style={{
            marginTop: '3rem',
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.6em',
            color: '#C8F135',
            opacity: 0,
            animation: phase >= 4
              ? 'fadeSlideUp 0.5s ease forwards, counterBlink 1.2s ease-in-out 0.5s infinite'
              : 'none',
          }}>
            {String(pct).padStart(3, '0')}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: '2px',
          background: 'rgba(200,241,53,0.07)',
          zIndex: 3,
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #7aaa10, #C8F135, #d8ff55)',
            width: `${pct}%`,
            transition: 'width 180ms ease',
            boxShadow: '0 0 12px #C8F135, 0 0 28px rgba(200,241,53,0.4)',
          }} />
        </div>
      </div>
    </>
  );
}