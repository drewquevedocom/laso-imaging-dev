import { Link } from "react-router-dom";

// Imaging Systems section images
import ctScanner from "@/assets/categories/ct-scanner.png";
import mriSystems from "@/assets/categories/mri-systems.png";

// Mobile & Portable section images
import mobileCt from "@/assets/categories/mobile-ct.png";
import mobileMri from "@/assets/categories/mobile-mri.png";
import mobilePetct from "@/assets/categories/mobile-petct.png";
import mobileXray from "@/assets/categories/mobile-xray.png";

// Parts section images
import rfCoils from "@/assets/categories/rf-coils.png";
import mriParts from "@/assets/categories/mri-parts.png";
import ctParts from "@/assets/categories/ct-parts.png";
import powerSupplies from "@/assets/categories/power-supplies.png";
const EquipmentCategories = () => {
  // Imaging Systems - updated with accurate counts and proper query links
  const categories = [
    { name: "MRI Systems", count: 82, image: mriSystems, link: "/products?category=mri-systems" },
    { name: "CT Scanners", count: 51, image: ctScanner, link: "/products?category=ct-scanners" },
    { name: "1.5T MRI", count: 49, image: mriSystems, link: "/products?category=1-5t-mri" },
    { name: "3.0T MRI", count: 13, image: mriSystems, link: "/products?category=3t-mri" },
  ];

  // Mobile & Portable - all 4 categories
  const mobileCategories = [
    { name: "Mobile MRI", count: 20, image: mobileMri, link: "/products?category=mobile-mri" },
    { name: "Mobile CT", count: 1, image: mobileCt, link: "/products?category=mobile-ct" },
    { name: "Mobile PET/CT", count: null, image: mobilePetct, link: "/products?category=mobile-petct" },
    { name: "Mobile X-Ray", count: null, image: mobileXray, link: "/products?category=mobile-xray" },
  ];

  // Parts - updated with accurate counts from Shopify inventory
  const partsCategories = [
    { name: "RF Coils", count: 126, image: rfCoils, link: "/products?category=rf-coils" },
    { name: "MRI Parts", count: 296, image: mriParts, link: "/products?category=mri-parts" },
    { name: "CT Parts", count: 85, image: ctParts, link: "/products?category=ct-parts" },
    { name: "Power Supplies", count: 39, image: powerSupplies, link: "/products?category=power-supplies" },
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Imaging Systems Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Imaging Systems</h2>
            <Link to="/products?category=mri-systems" className="text-accent hover:underline font-medium">View All</Link>
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
            <Link to="/products?category=mobile-mri" className="text-accent hover:underline font-medium">Browse All Mobile</Link>
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
