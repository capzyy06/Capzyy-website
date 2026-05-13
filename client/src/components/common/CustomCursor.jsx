import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ref = useRef(null);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mq.matches);

    const handler = (e) => setIsPointerDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isPointerDevice) return;

    const dot = ref.current;
    if (!dot) return;

    const move = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    const over = (e) => {
      const t = e.target;
      if (t.closest("a, button, [data-cursor='hover']")) dot.classList.add('grow');
      else dot.classList.remove('grow');

      if (t.closest("[data-cursor='lime']")) dot.classList.add('lime');
      else dot.classList.remove('lime');
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [isPointerDevice]);

  if (!isPointerDevice) return null;

  return <div ref={ref} className="cursor-dot" aria-hidden="true" />;
}