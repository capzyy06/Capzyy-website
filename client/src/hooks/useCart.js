import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { openCart } from '../store/slices/uiSlice';
import toast from 'react-hot-toast';

export function useCart() {
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector(s => s.cart);

  const add = (product, variant = {}, quantity = 1) => {
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images?.[0]?.url || '', slug: product.slug, variant, quantity }));
    dispatch(openCart());
    toast.success('Added to cart!');
  };

  const remove = (key) => dispatch(removeFromCart(key));
  const updateQty = (key, quantity) => dispatch(updateQuantity({ key, quantity }));
  const clear = () => dispatch(clearCart());

  return { items, total, itemCount, add, remove, updateQty, clear };
}
