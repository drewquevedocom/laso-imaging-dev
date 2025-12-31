import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "LASO Imaging Solutions provided us with a refurbished 3T MRI system that performs like new. Their team handled everything from site planning to installation flawlessly.",
      name: "Dr. Sarah Mitchell",
      title: "Chief Radiologist",
      company: "Metro Health Medical Center",
    },
    {
      quote: "The training programs are exceptional. Our technologists were fully certified and confident operating the new system within weeks. Highly recommend their service.",
      name: "Michael Chen",
      title: "Director of Imaging",
      company: "Pacific Northwest Hospital",
    },
    {
      quote: "When our MRI went down unexpectedly, LASO had a rental unit delivered and operational within 48 hours. They saved us from weeks of lost revenue.",
      name: "Jennifer Adams",
      title: "Operations Manager",
      company: "Sunrise Diagnostic Center",
    },
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-muted-foreground text-sm uppercase tracking-wider">Customer Stories</span>
          <h2 className="text-3xl font-bold text-foreground mt-2">Trusted by Healthcare Leaders</h2>
          <p className="text-muted-foreground mt-3">
            See what our clients say about their experience working with LASO Imaging Solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 border border-border shadow-card"
            >
              <Quote className="h-8 w-8 text-accent/30 mb-4" />
              <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                <p className="text-sm text-accent">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
