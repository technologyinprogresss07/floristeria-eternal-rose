import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Products } from './components/Products';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartModal } from './components/CartModal';
import { OrderModal } from './components/OrderModal';
import { AdminPanel } from './components/AdminPanel';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface Product {
  id: string | null;
  name: string;
  price: number;
  image_url: string;
  description: string;
  is_active: boolean;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isAdminRoute = window.location.pathname === "/admin";

  // Cargar productos desde localStorage al iniciar
  useEffect(() => {
  const loadProducts = async () => {
    let query = supabase
      .from('products')
      .select('id, name, price, image_url, description, is_active')
      .order('name', { ascending: true });

    // Si NO estás en /admin, solo mostrar productos activos al público
    if (!isAdminRoute) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
  console.error('Error cargando productos:', error);
  setProducts([]); // ✅ limpia si falló
  return;
  }

    setProducts((data ?? []) as Product[]);
  };

  loadProducts();
}, [isAdminRoute]);

  // Actualizar productos y guardar en localStorage
  const handleUpdateProducts = (newProducts: Product[]) => {
  if (!isAdminRoute) {
    setProducts(newProducts.filter(p => p.is_active));
    return;
  }
  setProducts(newProducts);
};

  const handleAddToCart = (product: { id: string; name: string; price: number; image_url: string }) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

 return (
  <div className="min-h-screen">
    {!isAdminRoute && (
      <>
        <Header 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenOrder={() => setIsOrderOpen(true)}
          cartItemsCount={totalItems}
        />
        <main>
          <Hero />
          <Products products={products} onAddToCart={handleAddToCart} />
          <About />
          <Contact />
        </main>
        <Footer />
        <WhatsAppButton />
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
        <OrderModal
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
        />
      </>
    )}
    {isAdminRoute && (
      <AdminPanel
        isOpen={true}
        onClose={() => (window.location.href = "/")}
        products={products}
        onUpdateProducts={handleUpdateProducts}
      />
    )}
  </div>
);
}