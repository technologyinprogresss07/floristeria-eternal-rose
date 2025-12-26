import { Leaf, Heart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Totalmente Natural',
    description: 'Utilizamos un proceso de preservación natural que mantiene la textura y suavidad original de cada pétalo'
  },
  {
    icon: Heart,
    title: 'Amor Duradero',
    description: 'Nuestras flores eternas duran años sin necesidad de agua ni cuidados especiales'
  },
  {
    icon: Sparkles,
    title: 'Belleza Perfecta',
    description: 'Cada flor es seleccionada en su momento de máxima belleza para garantizar la perfección'
  }
];

export function About() {
  return (
    <section id="nosotros" className="py-20 bg-gradient-to-b from-background to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">¿Por qué Flores Eternas?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La belleza de la naturaleza preservada con amor y dedicación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl mb-6">Nuestra Historia</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Comenzamos con una simple idea: crear momentos que duren para siempre. 
              Cada rosa eterna que creamos es un testimonio de amor, dedicación y el 
              deseo de capturar la belleza de la naturaleza en su estado más perfecto.
            </p>
            <p className="text-lg text-muted-foreground">
              Utilizamos técnicas de preservación avanzadas que mantienen la frescura, 
              textura y color de cada flor, transformándolas en obras de arte que 
              perdurarán en el tiempo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
