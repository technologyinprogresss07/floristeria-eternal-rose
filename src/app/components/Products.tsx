import { ProductCard } from './ProductCard';

interface Product {
  id: string | null;
  name: string;
  price: number;
  image_url: string;
  description: string;
  is_active: boolean;
}

interface ProductsProps {
  products: Product[];
  onAddToCart: (product: { id: string; name: string; price: number; image_url: string }) => void;
}

export function Products({ products, onAddToCart }: ProductsProps) {
  return (
    <section id="productos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Nuestra Colección</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada flor es cuidadosamente seleccionada y preservada para mantener 
            su belleza natural durante años
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard
                key={product.id ?? product.name}
                id={product.id}
                name={product.name}
                price={product.price}
                image_url={product.image_url}
                description={product.description}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay productos disponibles en este momento.</p>
            <p className="text-sm mt-2">El administrador puede agregar productos desde el panel de administración.</p>
          </div>
        )}
      </div>
    </section>
  );
}