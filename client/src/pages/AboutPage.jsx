import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="max-w-3xl">
        <p className="text-textMuted text-xs tracking-widest uppercase mb-4">Our Story</p>
        <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white mb-10 leading-none">CAPS ONLY.</h1>
        <div className="space-y-6 text-textSecondary text-base leading-relaxed">
          <p>Capzyy started with one simple idea — there are too many stores trying to sell everything to everyone. We decided to do the opposite.</p>
          <p>We sell caps. That's it. Snapbacks, truckers, bucket hats, beanies, fitted caps — whatever sits on your head, we've got it. Carefully picked, properly priced, and shipped straight to you.</p>
          <p>Find us on Instagram <a href="https://instagram.com/capzyy" target="_blank" rel="noreferrer" className="text-white hover:text-gray-300 underline">@capzyy</a> where we drop new styles, run exclusives, and actually talk to the people who wear our stuff.</p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/shop" className="btn-primary">Shop All Caps</Link>
          <a href="https://instagram.com/capzyy" target="_blank" rel="noreferrer" className="btn-secondary">Follow @capzyy</a>
        </div>
      </div>
    </div>
  );
}
