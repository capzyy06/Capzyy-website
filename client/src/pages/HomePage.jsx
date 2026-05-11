import HeroBanner from '../components/home/HeroBanner';
import MarqueeStrip from '../components/home/MarqueeStrip';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedCollection from '../components/home/FeaturedCollection';
import InstagramFeed from '../components/home/InstagramFeed';
import Preloader from '../components/common/Preloader';
import BrandStatement from '../components/home/BrandStatement';
import Reviews from '../components/home/Reviews';

export default function HomePage() {
  return (
    <div className="relative bg-bg text-white">
      <Preloader />
      <div className="grain" />
      <HeroBanner />
      <MarqueeStrip invert />
      <CategoryGrid />
      <FeaturedCollection />
      <BrandStatement />
      <MarqueeStrip
        items={['SNAPBACK','TRUCKER','BUCKET HAT','DAD CAP','FITTED','5-PANEL','BEANIE']}
      />
      <Reviews />
      <InstagramFeed />
    </div>
  );
}