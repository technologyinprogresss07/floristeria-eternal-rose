import { Heart, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  onAddToCart: (product: { id: number; name: string; price: string; image: string }) => void;
}

export function ProductCard({ id, name, price, image, description, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({ id, name, price, image });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden aspect-square">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all ${
            isFavorite ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl mb-2">{name}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl text-primary">{price}</span>
          <button 
            onClick={handleAddToCart}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              justAdded 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {justAdded ? '¡Añadido!' : 'Añadir'}
          </button>
        </div>
      </div>
    </div>
  );
}