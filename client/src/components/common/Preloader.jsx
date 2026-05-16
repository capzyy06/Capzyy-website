import { useEffect, useState } from 'react';
import CapzyyLogo from '../../assets/Capzyy_logo.png';

export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 8 + 4;
      if (v >= 100) {
        v = 100;
        setPct(100);
        clearInterval(id);
        // 900ms hold at 100% → then slide up (750ms) → then notify parent
        setTimeout(() => {
          setDone(true);
          // wait for the 0.75s slide-up transition to fully finish before showing chat
          setTimeout(() => onDone?.(), 800);
        }, 900);
      } else {
        setPct(Math.floor(v));
      }
    }, 120);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: done ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.75s cubic-bezier(0.76,0,0.24,1)',
        pointerEvents: done ? 'none' : 'auto',
      }}
      aria-hidden={done}
    >
      <img
        src={CapzyyLogo}
        alt="Capzyy"
        style={{
          width: '420px',
          height: '420px',
          objectFit: 'contain',
        }}
      />

      {/* Progress bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'rgba(200,241,53,0.07)',
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
  );
}