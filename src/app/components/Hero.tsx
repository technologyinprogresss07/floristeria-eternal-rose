import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-[600px] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1587371921769-eda287cc0209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZXJ2ZWQlMjByb3NlcyUyMHBpbmt8ZW58MXx8fHwxNzY2NjkxNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Flores eternas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl mb-6">Belleza que Perdura para Siempre</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Descubre la magia de las flores eternas. Rosas preservadas que mantienen su belleza 
            y elegancia durante años, perfectas para expresar amor duradero.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={scrollToProducts}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Ver Colección
            </button>
            <button 
              onClick={scrollToAbout}
              className="bg-white text-foreground px-8 py-3 rounded-full border border-border hover:bg-muted transition-colors"
            >
              Saber Más
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}