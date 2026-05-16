import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: #f5f4f0;
    color: #1a1a2e;
    min-height: 100vh;
    padding: 2rem 1rem;
  }

  .page {
    max-width: 720px;
    margin: 0 auto;
  }

  /* Hero */
  .hero {
    background: #1a1a2e;
    border-radius: 20px;
    padding: 2.5rem 2rem 2rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  .hero-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
  }
  .hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.1);
    color: #ffd97d;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 99px;
    margin-bottom: 1rem;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .hero-icon { font-size: 44px; margin-bottom: 0.75rem; display: block; }
  .hero h1 {
    font-family: 'Baloo 2', sans-serif;
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 0.6rem;
  }
  .hero p {
    color: rgba(255,255,255,0.6);
    font-size: 15px;
    line-height: 1.65;
  }

  /* Stat cards */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 12px;
    margin-bottom: 1.5rem;
  }
  .stat-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e8e6e0;
    padding: 1.25rem;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(26,26,46,0.08);
  }
  .stat-card .card-icon { font-size: 24px; margin-bottom: 10px; display: block; }
  .stat-card h3 {
    font-family: 'Baloo 2', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 4px;
  }
  .stat-card .highlight {
    font-size: 21px;
    font-weight: 700;
    font-family: 'Baloo 2', sans-serif;
    color: #1a1a2e;
    display: block;
    margin-bottom: 4px;
  }
  .stat-card p { font-size: 13px; color: #6b6b80; line-height: 1.55; }

  /* Section title */
  .section-title {
    font-family: 'Baloo 2', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin: 1.75rem 0 0.85rem;
    color: #1a1a2e;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Timeline */
  .timeline {
    border: 1px solid #e8e6e0;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
  }
  .timeline-step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e8e6e0;
    transition: background 0.15s;
  }
  .timeline-step:last-child { border-bottom: none; }
  .timeline-step:hover { background: #fafaf8; }
  .step-num {
    min-width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #1a1a2e;
    color: #ffd97d;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'Baloo 2', sans-serif;
  }
  .step-content h4 { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 3px; }
  .step-content p { font-size: 13px; color: #6b6b80; line-height: 1.55; }

  /* FAQ */
  .faq-list { display: flex; flex-direction: column; gap: 8px; }
  .faq-item {
    background: #fff;
    border: 1px solid #e8e6e0;
    border-radius: 12px;
    overflow: hidden;
  }
  .faq-question {
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #1a1a2e;
    gap: 12px;
    transition: background 0.15s;
  }
  .faq-question:hover { background: #fafaf8; }
  .faq-chevron {
    font-size: 18px;
    color: #1a1a2e;
    transition: transform 0.22s ease;
    flex-shrink: 0;
  }
  .faq-chevron.open { transform: rotate(180deg); }
  .faq-answer {
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.25s ease;
    max-height: 0;
    opacity: 0;
  }
  .faq-answer.open { max-height: 200px; opacity: 1; }
  .faq-answer p {
    padding: 0 1.25rem 1rem;
    font-size: 13px;
    color: #6b6b80;
    line-height: 1.65;
  }

  /* Contact bar */
  .contact-bar {
    background: #ffd97d;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 1.75rem;
    flex-wrap: wrap;
  }
  .contact-bar .contact-text p {
    font-size: 14px;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 2px;
  }
  .contact-bar .contact-text span {
    font-size: 12px;
    color: rgba(26,26,46,0.65);
    font-weight: 500;
  }
  .contact-btn {
    background: #1a1a2e;
    color: #ffd97d;
    font-size: 13px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .contact-btn:hover { opacity: 0.88; transform: scale(0.98); }

  /* Footer note */
  .footer-note {
    text-align: center;
    font-size: 12px;
    color: #9999aa;
    margin-top: 2rem;
    padding-bottom: 1rem;
  }
`;

const statCards = [
  { icon: "📦", title: "Standard Shipping", highlight: "5–7 days", desc: "Estimated delivery after your order is confirmed and dispatched." },
  { icon: "🚀", title: "Processing Time", highlight: "1–2 days", desc: "Orders are packed and handed to our courier within 1–2 business days." },
  { icon: "💸", title: "Free Shipping", highlight: "On 2+ Caps", desc: "Order 2 or more caps and shipping is on us. Single cap orders ship for a flat ₹99. No hidden charges!" },
];

const steps = [
  { title: "Place your order", desc: "Pick your cap, check out, and you'll get a confirmation email right away. That's your cue — we've got it!" },
  { title: "We pack it with love", desc: "Within 1–2 business days, our team carefully packs your order and prepares it for dispatch." },
  { title: "Out for delivery", desc: "You'll receive a tracking number via email/SMS so you can follow your cap's journey in real time." },
  { title: "Cap's here! 🎉", desc: "Receive your order, try it on, and rock your new cap. If anything's off, we're just a message away." },
];

const faqs = [
  {
    q: "Can I change my delivery address after placing the order?",
    a: "Yes, but only if your order hasn't been dispatched yet. Contact us within 12 hours of placing the order and we'll sort it out!",
  },
  {
    q: "What if my order is delayed?",
    a: "Delays can sometimes happen due to high volume or courier issues. If your order hasn't arrived within 10 business days, reach out to us and we'll investigate right away.",
  },
  {
    q: "Do you ship across India?",
    a: "Yes! We ship to all major cities and most pin codes across India. Enter your pin code at checkout to confirm availability for your area.",
  },
  {
    q: "My package arrived damaged — what do I do?",
    a: "We're sorry about that! Take a photo of the damaged package and product, and email us within 48 hours of delivery. We'll make it right.",
  },
];

export default function CapzyyDeliveryPolicy() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        {/* Hero */}
        <div className="hero">
          <div className="hero-dots" />
          <span className="hero-icon">🧢</span>
          <div className="hero-badge">Delivery Policy</div>
          <h1>We deliver your faves,<br />fresh to your door</h1>
          <p>Everything you need to know about how your Capzyy order gets from our hands to yours. Simple, honest, no surprises.</p>
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          {statCards.map((card) => (
            <div className="stat-card" key={card.title}>
              <span className="card-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <span className="highlight">{card.highlight}</span>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="section-title">🛣️ How your order gets to you</div>
        <div className="timeline">
          {steps.map((step, i) => (
            <div className="timeline-step" key={i}>
              <div className="step-num">{i + 1}</div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="section-title">❓ Common questions</div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div className="faq-item" key={i}>
              <button
                className="faq-question"
                onClick={() => toggleFaq(i)}
                aria-expanded={openFaq === i}
              >
                {faq.q}
                <span className={`faq-chevron ${openFaq === i ? "open" : ""}`}>▾</span>
              </button>
              <div className={`faq-answer ${openFaq === i ? "open" : ""}`}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="contact-bar">
          <div className="contact-text">
            <p>Still have questions? We're happy to help!</p>
            <span>Mon – Sat, 10am to 6pm</span>
          </div>
          <a
            href="https://wa.me/919142379740?text=Hey+Capzyy+%F0%9F%91%8B%0AI%E2%80%99m+looking+to+buy+a+cap+%E2%80%94+can+you+show+me+your+latest+collection+and+prices%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.057 23.571a.75.75 0 0 0 .921.921l5.717-1.475A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.512-5.228-1.402l-.374-.218-3.893 1.004 1.025-3.792-.236-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Chat With Us
          </a>
        </div>

        <p className="footer-note">© 2025 Capzyy · All rights reserved · Prices & timelines subject to change.</p>
      </div>
    </>
  );
}