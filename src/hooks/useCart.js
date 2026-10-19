import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'ShoppingCart';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    // Older versions stored quantity as a string.
    return saved.map((item) => ({ ...item, quantity: Number(item.quantity) || 1 }));
  } catch {
    return [];
  }
};

const useCart = () => {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage may be blocked or full; keep the in-memory cart working.
    }
  }, [cart]);

  const addItem = (product, quantity = 1) => {
    setCart((items) =>
      items.some((item) => item.id === product.id)
        ? items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...items, { ...product, quantity }],
    );
    Toast.fire({
      icon: 'success',
      title: `${product.display_name} (${quantity} pc/s) has been added to your cart!`,
    });
  };

  const updateQuantity = (id, quantity) =>
    setCart((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)));

  const removeItem = (product) => {
    setCart((items) => items.filter((item) => item.id !== product.id));
    Toast.fire({ icon: 'info', title: `${product.display_name} has been removed from your cart!` });
  };

  return { cart, addItem, updateQuantity, removeItem };
};

export default useCart;
