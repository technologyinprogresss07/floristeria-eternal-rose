import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // AJUSTA la ruta si tu carpeta es diferente
import { ProductCard } from "./ProductCard";

const initialProducts = [
  { id: "1", name: 'Rosa Eterna Individual', price: '$175.00', image: '/productos/rosaIndividual.jpeg', description: 'Rosa elegante presentada con envoltura fina, ideal para un detalle sencillo y especial.' },
  { id: "2", name: 'Ramo de 3 Rosas', price: '$500.00', image: '/productos/ramo3rosas.jpeg', description: 'Hermoso ramo minimalista, perfecto para expresar amor y cariño.' },
  { id: "3", name: 'Ramo de 7 Rosas + 1 Girasol', price: '$800.00', image: '/productos/ramoConGirasol.jpeg', description: 'Combinación vibrante de rosas y girasol que transmite alegría y amor.'},
  { id: "4", name: 'Ramo de 10 Rosas con Mariposas', price: '$1,000.00', image: '/productos/ramoConMariposas.jpeg', description: 'Ramo llamativo y romántico decorado con delicadas mariposas.' },
  { id: "5", name: 'Rosa Azul Individual', price: '$175.00', image: '/productos/rosaAzulIndividual.jpeg', description: 'Rosa azul única y sofisticada, símbolo de originalidad y misterio.' },
  { id: "6", name: 'Ramo de 3 Rosas Azules', price: '$400.00', image: '/productos/ramo3RosasAzules.jpeg', description: 'Detalle moderno y elegante, ideal para sorprender.' },
  { id: "7", name: 'Ramo de 5 Rosas Azules', price: '$475.00', image: '/productos/ramo5rosasAzules.jpeg', description: 'Ramo delicado con un toque exclusivo y diferente.' },
  { id: "8", name: 'Ramo de 11 Rosas Azules con Moñitos', price: '$1,300.00', image: '/productos/ramo11rosasAzulesConMonitos.jpeg', description: 'Arreglo premium con detalles finos que resaltan su elegancia.' },
  { id: "9", name: 'Girasol Azul', price: '$200.00', image: '/productos/girasolAzul.jpeg', description: 'Diseño original y fuera de lo común, perfecto para regalos únicos.' },
  { id: "10", name: 'Girasol Individual', price: '$200.00', image: '/productos/girasolIndividual.jpeg', description: 'Flor radiante que simboliza felicidad y energía positiva.' },
  { id: "11", name: 'Ramo de 3 Girasoles', price: '$450.00', image: '/productos/ramo3girasoles.jpeg', description: 'Arreglo alegre y luminoso, ideal para levantar el ánimo.' },
  { id: "12", name: 'Ramo de 7 Girasoles', price: '$1,300.00', image: '/productos/ramo7girasoles.jpeg', description: 'Ramo abundante y vibrante que transmite amor y optimismo.'},
  { id: "13", name: 'Rosa Individual', price: '$150.00', image: '/productos/rositaIndividual.jpeg', description: 'Rosa delicada que representa elegancia y admiración.' },
  { id: "14", name: 'Ramo de 3 Rosas Moradas', price: '$450.00', image: '/productos/ramo3rosasMoradas.jpeg', description: 'Sutil y romántico, ideal para sorprender.' },
  { id: "15", name: 'Ramo de 7 Rosas Moradas', price: '$800.00', image: '/productos/ramo7rosasMoradas.jpeg', description: 'Arreglo sofisticado con un toque romántico.' },
  { id: "16", name: 'Ramo de Rosas (Mix)', price: '$1,350.00', image: '/productos/rosasMixtas.jpeg', description: 'Arreglo armonioso y elegante para regalar.' },
  { id: "17", name: 'Cajita de 3 Rosas y Chocolates', price: '$750.00', image: '/productos/cajitaRosaChocolate.jpeg', description: 'La combinación perfecta de flores y dulzura.' }
];

interface ProductsProps {
  onAddToCart: (product: { id: string; name: string; price: string; image: string }) => void;
}

export function Products({ onAddToCart }: ProductsProps) {
  type Product = {
  id: string;
  name: string;
  price: number | string;
  description: string | null;
  image_url?: string; // supabase
  image?: string;     // local
};

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const ADMIN_UID = "6a913746-8210-4891-8089-1167ac7ddbf7";

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price,description,image_url")
        .order("created_at", { ascending: false });

      if (error) {
      console.error("Error cargando productos:", error.message);
      setProducts(initialProducts);
      return;
    }
      if (data && data.length > 0) {
      setProducts(data as Product[]);
    } else {
      setProducts(initialProducts);
    }
    })();
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
          <ProductCard
            key={product.id}
            id={String(product.id)}
            name={product.name}
            price={
              typeof product.price === "string"
                ? product.price
                : `$${Number(product.price).toFixed(2)}`
            }
            image={product.image_url ?? product.image ?? ""}
            description={product.description ?? ""}
            onAddToCart={onAddToCart}
          />
          ))}
        </div>
      </div>
    </section>
  );
}