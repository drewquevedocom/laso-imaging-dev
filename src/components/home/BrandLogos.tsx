import geLogo from "@/assets/brands/ge.jpg";
import philipsLogo from "@/assets/brands/philips.jpg";
import toshibaLogo from "@/assets/brands/toshiba.jpg";
import siemensLogo from "@/assets/brands/siemens.jpg";

const BrandLogos = () => {
  const brands = [
    { name: "GE Healthcare", logo: geLogo },
    { name: "Philips", logo: philipsLogo },
    { name: "Toshiba", logo: toshibaLogo },
    { name: "Siemens", logo: siemensLogo },
  ];

  return (
    <section className="py-8 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-12 md:gap-24 flex-wrap">
          {brands.map((brand) => (
            <div 
              key={brand.name}
              className="h-12 md:h-16 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
