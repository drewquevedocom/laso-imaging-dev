import { Link } from "react-router-dom";

// MRI Machines section images
import ctScanner from "@/assets/categories/ct-scanner.png";
import mriSystems from "@/assets/categories/mri-systems.png";
import petctScanners from "@/assets/categories/petct-scanners.png";
import xrayUnits from "@/assets/categories/xray-units.png";

// Mobile & Portable section images
import mobileCt from "@/assets/categories/mobile-ct.png";
import mobileMri from "@/assets/categories/mobile-mri.png";
import mobilePetct from "@/assets/categories/mobile-petct.png";
import mobileXray from "@/assets/categories/mobile-xray.png";

const EquipmentCategories = () => {
  const categories = [
    { name: "CT Scanners", count: 27, image: ctScanner, link: "/equipment/ct-scanners" },
    { name: "MRI Systems", count: 45, image: mriSystems, link: "/equipment/mri-systems" },
    { name: "PET/CT Scanners", count: 11, image: petctScanners, link: "/equipment/petct-scanners" },
    { name: "X-RAY Units", count: 4, image: xrayUnits, link: "/equipment/xray-units" },
  ];

  const mobileCategories = [
    { name: "CT Scanners", count: 1, image: mobileCt, link: "/equipment/mobile/ct" },
    { name: "MRI Unit", count: 13, image: mobileMri, link: "/equipment/mobile/mri" },
    { name: "PET/CT Scanners", count: null, image: mobilePetct, link: "/equipment/mobile/petct" },
    { name: "X-RAY Unit", count: 4, image: mobileXray, link: "/equipment/mobile/xray" },
  ];

  const partsCategories = [
    { name: "RF Coils", count: 24, image: mriSystems, link: "/parts/rf-coils" },
    { name: "Power Supplies", count: 18, image: ctScanner, link: "/parts/power-supplies" },
    { name: "MRI Parts", count: 56, image: petctScanners, link: "/parts/mri-parts" },
    { name: "Accessories", count: 32, image: xrayUnits, link: "/parts/accessories" },
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* MRI Machines Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">MRI Machines</h2>
            <Link to="/equipment" className="text-accent hover:underline font-medium">View All</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>

        {/* Mobile & Portable Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Mobile & Portable</h2>
            <Link to="/equipment/mobile" className="text-accent hover:underline font-medium">Browse All Mobile</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mobileCategories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>

        {/* Parts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Parts</h2>
            <Link to="/parts" className="text-accent hover:underline font-medium">Browse All Parts</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partsCategories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ name, count, image, link }: { name: string; count: number | null; image: string; link: string }) => (
  <Link 
    to={link}
    className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-card hover:border-accent/30 transition-all group"
  >
    <div className="h-40 mb-4 flex items-center justify-center overflow-hidden rounded-md">
      <img 
        src={image} 
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
    </div>
    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{name}</h3>
    {count !== null && (
      <span className="text-muted-foreground text-sm">({count})</span>
    )}
  </Link>
);

export default EquipmentCategories;
