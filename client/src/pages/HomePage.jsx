import HeroBanner from '../components/home/HeroBanner';
import MarqueeStrip from '../components/home/MarqueeStrip';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedCollection from '../components/home/FeaturedCollection';
import InstagramFeed from '../components/home/InstagramFeed';
import Preloader from '../components/common/Preloader';
import BrandStatement from '../components/home/BrandStatement';
import Reviews from '../components/home/Reviews';
import FAQ from '../components/home/FAQ';
import SupportWidget from '../components/home/SupportWidget';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage() {
  useReveal();
  const user = useSelector((state) => state.auth.user);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Fallback: show chat after 4s no matter what
    const fallback = setTimeout(() => setShowChat(true), 4000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div className="home-page relative bg-bg text-white">
      <Preloader onDone={() => setShowChat(true)} />
      <div className="grain" />
      <HeroBanner />
      <MarqueeStrip invert />
      <div id="categories">
        <CategoryGrid />
      </div>
      <div id="featured">
        <FeaturedCollection />
      </div>
      <BrandStatement />
      <MarqueeStrip
        items={[
          'SNAPBACK',
          'TRUCKER',
          'BUCKET HAT',
          'DAD CAP',
          'FITTED',
          '5-PANEL',
          'BEANIE',
        ]}
      />
      <div id="streets">
        <InstagramFeed />
      </div>
      <div id="reviews">
        <Reviews />
      </div>
      <FAQ />

      {showChat && <SupportWidget user={user} />}
    </div>
  );
}