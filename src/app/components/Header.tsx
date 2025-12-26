import { Heart, ShoppingBag, Menu, ClipboardList } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenOrder: () => void;
  cartItemsCount: number;
}

export function Header({ onOpenCart, onOpenOrder, cartItemsCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-2xl">by Eternal Rose</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="hover:text-primary transition-colors">Inicio</a>
            <a href="#productos" className="hover:text-primary transition-colors">Productos</a>
            <a href="#nosotros" className="hover:text-primary transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-primary transition-colors">Contacto</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenOrder}
              className="hover:text-primary transition-colors hidden sm:flex items-center gap-2 bg-secondary px-4 py-2 rounded-full" 
              aria-label="Hacer encargo"
            >
              <ClipboardList className="w-5 h-5" />
              <span className="hidden lg:inline">Encargo</span>
            </button>
            <button 
              onClick={onOpenCart}
              className="hover:text-primary transition-colors relative" 
              aria-label="Carrito"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <a href="#inicio" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
            <a href="#productos" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Productos</a>
            <a href="#nosotros" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Nosotros</a>
            <a href="#contacto" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Contacto</a>
            <button 
              onClick={() => {
                onOpenOrder();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full w-fit sm:hidden"
            >
              <ClipboardList className="w-5 h-5" />
              <span>Hacer Encargo</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}