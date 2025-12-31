const BrandLogos = () => {
  const brands = [
    { name: "GE Healthcare", initials: "GE" },
    { name: "Philips", initials: "PHILIPS" },
    { name: "Toshiba", initials: "TOSHIBA" },
    { name: "Siemens", initials: "SIEMENS" },
  ];

  return (
    <section className="py-8 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-12 md:gap-24 flex-wrap">
          {brands.map((brand) => (
            <div 
              key={brand.name}
              className="text-2xl md:text-3xl font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer"
            >
              {brand.initials}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
