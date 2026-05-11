import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import AnnouncementBar from './AnnouncementBar';
import CustomCursor from './CustomCursor';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <CustomCursor />
      {/* Announcement bar — sticky at very top */}
      <div className="sticky top-0 z-[60]">
        <AnnouncementBar />
        <Navbar />
      </div>
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}