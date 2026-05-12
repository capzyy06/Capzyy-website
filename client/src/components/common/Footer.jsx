import { Link } from 'react-router-dom';

const SocialIcons = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/capzyy?igsh=eHRmMGQ4MzhyeHN4&utm_source=qr',
    svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@capzyy06?si=UgrWazTugsp6CbDD',
    svg: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919142379740?text=Hey+Capzyy+%F0%9F%91%8B%0AI%E2%80%99m+looking+to+buy+a+cap+%E2%80%94+can+you+show+me+your+latest+collection+and+prices%3F&utm_source=chatgpt.com',
    svg: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1D5FeEWb6x/',
    svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  },
];

const shopLinks = [
  ['All Caps', '/shop'],
  ['New Arrivals', '/#featured'],
  ['Bestsellers', '/#streets'],
  ['About Us', '/about'],
];

const infoLinks = [
  ['Shipping Policy', '/capzyy-delivery-policy'],
  ['Contact Us', '/contact'],
];

const connectLinks = [
  ['WhatsApp', 'https://wa.me/919142379740?text=Hey+Capzyy+%F0%9F%91%8B%0AI%E2%80%99m+looking+to+buy+a+cap+%E2%80%94+can+you+show+me+your+latest+collection+and+prices%3F&utm_source=chatgpt.com'],
  ['Instagram', 'https://www.instagram.com/capzyy?igsh=eHRmMGQ4MzhyeHN4&utm_source=qr'],
  ['YouTube', 'https://youtube.com/@capzyy06?si=UgrWazTugsp6CbDD'],
  ['Facebook', 'https://www.facebook.com/share/1D5FeEWb6x/'],
];

export default function Footer() {
  return (
    <footer id="about" className="relative bg-surface border-t border-border">
      <div className="px-5 md:px-10 pt-10 pb-10">
        {/* Top grid */}
        <div className="grid lg:grid-cols-4 gap-10 mb-16">
          {/* Brand col */}
          <div>
            <h3
              data-text="CAPZYY®"
              className="glitch font-display text-4xl tracking-wider text-white"
            >
              CAPZYY<span className="text-green-500 text-[0.6em] align-super">©</span>
            </h3>
            <p className="font-body text-sm text-textSecondary mt-3 max-w-xs leading-relaxed">
              Premium caps. That's it. No clothes, no distractions. Just headwear built for
              people who actually care.
            </p>
            <div className="flex gap-3 mt-6">
              {SocialIcons.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 border border-border flex items-center justify-center text-textSecondary hover:bg-white hover:text-black hover:border-white hover:rotate-12 transition duration-300"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.svg}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: 'Shop', links: shopLinks },
            { title: 'Info', links: infoLinks },
            { title: 'Connect', links: connectLinks },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-condensed text-2xs tracking-[0.4em] text-green-300 uppercase mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link to={href} className="story-link font-body text-sm text-textSecondary hover:text-white">
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="story-link font-body text-sm text-textSecondary hover:text-white"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant brand wordmark */}
        <div className="overflow-hidden -mx-5 md:-mx-10 border-y border-border">
          <h2 className="font-display text-[20vw] leading-[0.85] tracking-tight text-white text-center py-5 select-none">
            CAPZYY<span className="text-green-500 text-[0.6em] align-super">©</span>
          </h2>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 font-condensed text-xs tracking-wider uppercase">
          <p className="text-white">© 2025 CAPZYY<span className="text-green-500 text-[0.6em] align-super">©</span> · All rights reserved</p>
         <p className="text-white tracking-wide text-sm uppercase">
  Designed & Developed by{" "}
  <a
    href="https://technivaran.in"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:underline transition-colors"
  >
    Technivaran
  </a>
</p>
        </div>
      </div>
    </footer>
  );
}