import { Link } from 'react-router-dom';
import logo from '../assets/capzyy-logo.jpeg';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-white overflow-hidden">

      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-36">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7">

              <p className="font-condensed text-xs tracking-[0.5em] text-[#C8F135] mb-6 uppercase">
                — About Capzyy
              </p>

              <h1 className="font-display text-[18vw] md:text-[10vw] leading-[0.85] tracking-tight text-white uppercase">
                Built
                <br />
                Different.
              </h1>

              <div className="mt-12 max-w-2xl">
                <p className="text-xl md:text-2xl text-textSecondary leading-relaxed">
                  Capzyy was never made to follow — it was built from the underground.
                </p>
              </div>

            </div>

            {/* Right Logo */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">

              <div className="relative">

                <img
                  src={logo}
                  alt="Capzyy Logo"
                  className="w-[280px] md:w-[360px] object-contain opacity-95"
                />

                {/* Glow */}
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10" />

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">

          {/* Left label */}
          <div className="lg:col-span-3">
            <p className="font-condensed text-xs tracking-[0.5em] text-textMuted uppercase sticky top-24">
              — Our Story
            </p>
          </div>

          {/* Right content */}
          <div className="lg:col-span-9">

            <div className="space-y-8 text-textSecondary text-lg leading-relaxed">

              <p>
                Inspired by street dance culture, where movement becomes identity
                and style becomes self-expression, Capzyy started with nothing
                but vision, hustle, and obsession for originality.
              </p>

              <p>
                What began as a simple passion for caps slowly turned into a
                brand built around confidence, individuality, and the energy of
                the streets. Every collection reflects a mindset — bold,
                unapologetic, and impossible to ignore.
              </p>

              <p>
                Rooted in rhythm, shaped by hustle, and driven by creativity,
                Capzyy represents people who move differently. People who create
                their own lane instead of waiting for permission.
              </p>

              <p>
                From snapbacks and trucker caps to fitteds, beanies, and bucket
                hats — every piece is selected to carry attitude, presence, and
                authenticity.
              </p>

              <p>
                This isn’t just about fashion.
                <br />
                It’s about expression.
                <br />
                It’s about identity.
                <br />
                It’s about owning your space.
              </p>

            </div>

            {/* CTA */}
            <div className="mt-16 flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="btn-primary"
              >
                Explore Collection
              </Link>

              <a
                href="https://www.instagram.com/capzyy?igsh=eHRmMGQ4MzhyeHN4&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                Instagram @capzyy
              </a>

              <a
                href="https://wa.me/919142379740?text=Hey+Capzyy+%F0%9F%91%8B%0AI%E2%80%99m+looking+to+buy+a+cap+%E2%80%94+can+you+show+me+your+latest+collection+and+prices%3F&utm_source=chatgpt.com"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                WhatsApp Us
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* Giant wordmark */}
      <section className="overflow-hidden border-y border-border">
        <div className="py-10">

          <h2 className="font-display text-[20vw] leading-[0.8] tracking-tight text-center text-white/10 uppercase select-none">
            CAPZYY
            <span className="text-[0.35em] align-super text-white/20">
              ©
            </span>
          </h2>

        </div>
      </section>

      {/* Footer line */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-10">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <p className="font-condensed text-xs tracking-[0.4em] uppercase text-textMuted">
            Street Culture / Self Expression / Caps Only
          </p>

          <p className="text-sm text-textMuted">
            Built from the underground.
          </p>

        </div>

      </section>

    </div>
  );
}