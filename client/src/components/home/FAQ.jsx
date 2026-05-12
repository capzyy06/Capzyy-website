import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'We deliver within 6–7 working days across India. Once your order is placed, you\'ll receive a tracking update so you always know where your cap is headed.',
  },
  {
    q: 'Are your caps one-size-fits-all?',
    a: 'Most of our caps are one-size-fits-all with adjustable straps for the perfect fit. We also carry select styles in specific sizes — check the product page for size details before ordering.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods through our secure checkout — UPI, debit/credit cards, net banking, and wallets. You can also reach out to us directly on Instagram or WhatsApp to place your order.',
  },
  {
    q: 'What kind of quality can I expect?',
    a: 'Only the best. We source premium materials and work with high-value, internationally recognized brands. Every cap goes through strict quality checks before it reaches you — because we don\'t compromise on what goes on your head.',
  },
  {
    q: 'When do new collections drop?',
    a: 'New drops hit every week — fresh styles, limited units. Our stock moves fast so if you see something you like, don\'t sleep on it. Follow us on Instagram to be the first to know about every drop.',
  },
  {
    q: 'What if my size is not available?',
    a: 'If a specific size or style is sold out, drop us a message on Instagram or WhatsApp. We\'ll do our best to sort you out with the next restock or a suitable alternative.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section className="relative px-5 md:px-10 py-24 md:py-32 border-t border-border">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 reveal align-left">
          <p className="font-condensed text-xs tracking-[0.5em] mb-3" style={{ color: '#C8F135' }}>
            — FAQ
          </p>
          <h2
            className="font-display leading-none tracking-tight"
            style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: '#F5F0E8' }}
          >
            GOT QUESTIONS?
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-0">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border-b border-border reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between py-6 text-left gap-4"
              >
                <span
                  className="font-condensed text-base md:text-lg tracking-wide uppercase"
                  style={{ color: openIdx === i ? '#C8F135' : '#F5F0E8' }}
                >
                  {faq.q}
                </span>
                <span
                  className="flex-none w-8 h-8 flex items-center justify-center border transition-colors duration-300"
                  style={{
                    borderColor: openIdx === i ? '#C8F135' : '#2A2A2A',
                    color: openIdx === i ? '#C8F135' : '#888',
                  }}
                >
                  {openIdx === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              {/* Answer */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{ maxHeight: openIdx === i ? '300px' : '0px' }}
              >
                <p
                  className="font-body text-sm md:text-base leading-relaxed pb-6"
                  style={{ color: '#666' }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 reveal">
          <p className="font-condensed text-sm tracking-wider" style={{ color: '#555' }}>
            Still have questions?{' '}
            <a
              href="https://www.instagram.com/capzyy"
              target="_blank"
              rel="noreferrer"
              className="story-link"
              style={{ color: '#C8F135' }}
            >
              DM us on Instagram →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}