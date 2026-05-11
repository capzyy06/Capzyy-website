import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-[15vw] text-white/10 leading-none select-none">404</h1>
      <h2 className="font-display text-4xl tracking-widest text-white mb-4 -mt-4">CAP NOT FOUND</h2>
      <p className="text-textSecondary mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  );
}
