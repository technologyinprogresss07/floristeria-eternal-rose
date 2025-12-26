import { X, ShoppingBag, Trash2 } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export function CartModal({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity }: CartModalProps) {
  if (!isOpen) return null;
  const WHATSAPP_OWNER = "18299105423"; // número real de la dueña

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  function handleCheckout() {
  if (items.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const lines = items
    .map((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      const subtotal = price * item.quantity;
      return `• ${item.name} x${item.quantity} — $${subtotal.toFixed(2)}`;
    })
    .join("\n");

  const message = `
    Hola ☺️, quiero realizar esta compra:

    📄 Pedido:
    ${lines}

    💰 Total estimado: $${total.toFixed(2)}

    ¿Me confirmas disponibilidad, delivery y forma de pago? ☺️
    `.trim();

    const url = `https://wa.me/${WHATSAPP_OWNER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

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
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="mb-2">{item.name}</h4>
                    <p className="text-primary">{item.price}</p>
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
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
