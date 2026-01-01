import { Link } from 'react-router-dom';
import geLogo from "@/assets/brands/ge.jpg";
import philipsLogo from "@/assets/brands/philips.jpg";
import toshibaLogo from "@/assets/brands/toshiba.jpg";
import siemensLogo from "@/assets/brands/siemens.jpg";

const BrandLogos = () => {
  const brands = [
    { name: "GE Healthcare", logo: geLogo, slug: "ge" },
    { name: "Philips Healthcare", logo: philipsLogo, slug: "philips" },
    { name: "Toshiba / Canon Medical", logo: toshibaLogo, slug: "toshiba" },
    { name: "Siemens Healthineers", logo: siemensLogo, slug: "siemens" },
  ];

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium tracking-wide">
          TRUSTED BRANDS WE SERVICE & SELL
        </p>
        <div className="flex items-center justify-center gap-16 md:gap-32 flex-wrap">
          {brands.map((brand) => (
            <Link 
              key={brand.name}
              to={`/equipment/brand/${brand.slug}`}
              className="h-14 md:h-20 hover:scale-105 transition-transform duration-300 cursor-pointer"
              title={`View ${brand.name} equipment`}
            >
              <img 
                src={brand.logo} 
                alt={`${brand.name} - Medical Imaging Equipment`}
                className="h-full w-auto object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
