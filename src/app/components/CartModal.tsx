import { X, ShoppingBag, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartModal({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity }: CartModalProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => {
    const price = item.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl">Tu Carrito</h2>
          <button onClick={onClose} className="hover:text-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-background rounded-lg p-4">
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="mb-2">{item.name}</h4>
                    <p className="text-primary">RD${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-xl">
              <span>Total:</span>
              <span className="text-primary">RD${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
