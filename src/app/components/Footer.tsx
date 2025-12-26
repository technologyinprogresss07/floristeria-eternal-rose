import { Heart } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-gradient-to-b from-white to-background py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              <h3 className="text-xl">by Eternal Rose</h3>
            </div>
            <p className="text-muted-foreground">
              Belleza que perdura para siempre
            </p>
          </div>

          <div>
            <h4 className="mb-4">Enlaces</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#inicio" className="hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#productos" className="hover:text-primary transition-colors">Productos</a></li>
              <li><a href="#nosotros" className="hover:text-primary transition-colors">Nosotros</a></li>
              <li><a href="#contacto" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Información</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Envíos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Preguntas frecuentes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cuidados</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Newsletter</h4>
            <p className="text-muted-foreground mb-4">
              Suscríbete para recibir ofertas especiales
            </p>
            {subscribed ? (
              <div className="bg-primary/10 border border-primary rounded-lg p-3 text-center text-primary text-sm">
                ¡Suscrito con éxito!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Tu email"
                  className="flex-1 px-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button 
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 by Eternal Rose. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}