import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const SOCIALS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    label: 'Instagram',
    handle: '@capzyy',
    sub: 'DMs open — fastest response',
    href: 'https://www.instagram.com/capzyy?igsh=eHRmMGQ4MzhyeHN4&utm_source=qr',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
    label: 'WhatsApp',
    handle: '+91 91423 79740',
    sub: 'Tap to chat directly',
    href: 'https://wa.me/919142379740?text=Hey+Capzyy+%F0%9F%91%8B%0AI%E2%80%99m+looking+to+buy+a+cap+%E2%80%94+can+you+show+me+your+latest+collection+and+prices%3F',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    label: 'YouTube',
    handle: '@capzyy06',
    sub: 'Behind the scenes & drops',
    href: 'https://youtube.com/@capzyy06?si=UgrWazTugsp6CbDD',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    label: 'Facebook',
    handle: 'CAPZYY',
    sub: 'Updates & community',
    href: 'https://www.facebook.com/share/1D5FeEWb6x/',
  },
];

const INFO = [
  { label: 'Email', value: 'capzyy06@gmail.com', href: 'mailto:capzyy06@gmail.com' },
  { label: 'Phone', value: '+91 91423 79740', href: 'tel:+919142379740' },
  { label: 'Based In', value: 'Jamshedpur, Jharkhand — 831001', sub: 'Shipping across India' },
  { label: 'Hours', value: '8:00 AM – 8:00 PM', sub: 'IST, all days' },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyPhone = () => {
    navigator.clipboard.writeText('919142379740');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg min-h-screen text-white">
      <section className="px-5 md:px-16 py-5 md:py-22 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 border-b border-border pb-10">
          <p className="font-condensed text-xs tracking-[0.5em] mb-4" style={{ color: '#C8F135' }}>
            — REACH US
          </p>
          <h1 className="font-display leading-none tracking-tight text-white" style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}>
            GET IN TOUCH
          </h1>
          <p className="font-body text-sm mt-4 max-w-lg text-textSecondary">
            Available 8 AM – 8 PM. For the fastest response, reach out on Instagram or WhatsApp.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">

          {/* Left — info table */}
          <div>
            <p className="font-condensed text-xs tracking-[0.4em] uppercase mb-6 text-textSecondary">
              Contact Information
            </p>
            <div className="divide-y divide-border">
              {INFO.map((item, i) => (
                <div key={i} className="flex items-start justify-between py-5">
                  <span className="font-condensed text-xs tracking-[0.3em] uppercase text-textSecondary w-28 flex-none pt-0.5">
                    {item.label}
                  </span>
                  <div className="text-right">
                    {item.href ? (
                      <a href={item.href} className="font-condensed text-sm tracking-wider text-white hover:text-[#C8F135] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <span className="font-condensed text-sm tracking-wider text-white">{item.value}</span>
                    )}
                    {item.sub && (
                      <p className="font-condensed text-xs mt-1 text-textSecondary">{item.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Copy button */}
            <button
              onClick={copyPhone}
              className="mt-8 inline-flex items-center gap-2 border px-5 py-2.5 font-condensed text-xs tracking-[0.3em] uppercase transition-all duration-300"
              style={{
                borderColor: copied ? '#C8F135' : '#2A2A2A',
                color: copied ? '#C8F135' : '#888',
              }}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy Phone Number'}
            </button>
          </div>

          {/* Right — socials */}
          <div>
            <p className="font-condensed text-xs tracking-[0.4em] uppercase mb-6 text-textSecondary">
              Find Us On
            </p>
            <div className="space-y-3">
              {SOCIALS.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 px-5 py-4 border border-border group transition-all duration-300 hover:border-[#C8F135]"
                >
                  <span className="flex-none text-textSecondary group-hover:text-[#C8F135] transition-colors duration-300">
                    {s.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-condensed text-sm tracking-wider text-white">
                      {s.label}
                      <span className="ml-2 text-xs text-textSecondary">{s.handle}</span>
                    </p>
                    <p className="font-body text-xs mt-0.5 text-textSecondary">{s.sub}</p>
                  </div>
                  <span className="font-condensed text-xs text-[#C8F135] opacity-0 group-hover:opacity-100 transition-opacity flex-none">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}