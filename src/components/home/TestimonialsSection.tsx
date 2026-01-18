import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ahmed Ben Salah",
    role: "Client régulier",
    content: "Excellent service ! Mon écran iPhone a été réparé en moins de 2 heures. Prix très compétitif et équipe professionnelle.",
    rating: 5,
    avatar: "A",
  },
  {
    id: 2,
    name: "Fatma Trabelsi",
    role: "Étudiante",
    content: "Je recommande FGS Store à 100% ! Ils m'ont aidé pour mon inscription universitaire et réparé mon téléphone le même jour.",
    rating: 5,
    avatar: "F",
  },
  {
    id: 3,
    name: "Mohamed Gharbi",
    role: "Entrepreneur",
    content: "Service rapide et efficace. La qualité des accessoires est top et les prix sont imbattables à Zaghouan.",
    rating: 5,
    avatar: "M",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-card/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            Témoignages
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ce que disent nos{" "}
            <span className="text-gradient-gold">clients</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            La satisfaction de nos clients est notre priorité
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border card-hover"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Quote className="h-5 w-5 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
