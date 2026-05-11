import { useEffect, useState } from 'react';
import logo from '../../assets/capzyy-logo.jpeg';

export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 12 + 6;
      if (v >= 100) {
        v = 100;
        setPct(100);
        clearInterval(id);
        setTimeout(() => setDone(true), 500);
      } else {
        setPct(Math.floor(v));
      }
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center transition-transform duration-700"
      style={{
        background: '#0a0a0a',
        transform: done ? 'translateY(-100%)' : 'translateY(0)',
        pointerEvents: done ? 'none' : 'auto',
      }}
      aria-hidden={done}
    >
      {/* Square box centered on screen */}
      <div
        style={{
          width: 'min(80vw, 420px)',
          height: 'min(80vw, 420px)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {/* Corner accents */}
        {[
          { top: -1, left: -1, borderTop: '2px solid #C8F135', borderLeft: '2px solid #C8F135' },
          { top: -1, right: -1, borderTop: '2px solid #C8F135', borderRight: '2px solid #C8F135' },
          { bottom: -1, left: -1, borderBottom: '2px solid #C8F135', borderLeft: '2px solid #C8F135' },
          { bottom: -1, right: -1, borderBottom: '2px solid #C8F135', borderRight: '2px solid #C8F135' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
        ))}

        {/* Logo */}
        <img
          src={logo}
          alt="CAPZYY"
          style={{
            width: '75%',
            maxWidth: '300px',
            objectFit: 'contain',
          }}
        />

        {/* Percent counter */}
        <p
          style={{
            marginTop: '2rem',
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          {String(pct).padStart(3, '0')}
        </p>

        {/* Progress bar inside the box at the bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#C8F135',
              width: `${pct}%`,
              transition: 'width 150ms ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}