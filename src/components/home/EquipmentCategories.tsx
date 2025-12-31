import mriSystem from "@/assets/mri-system-1.jpg";
import ctScanner from "@/assets/ct-scanner.jpg";
import mobileMri from "@/assets/mobile-mri.jpg";

const EquipmentCategories = () => {
  const categories = [
    { name: "CT Scanners", count: 27, image: ctScanner },
    { name: "MRI Systems", count: 45, image: mriSystem },
    { name: "PET/CT Scanners", count: 11, image: ctScanner },
    { name: "X-RAY Units", count: 4, image: mriSystem },
  ];

  const mobileCategories = [
    { name: "CT Scanners", count: 1, image: ctScanner },
    { name: "MRI Unit", count: 13, image: mobileMri },
    { name: "PET/CT Scanners", count: null, image: ctScanner },
    { name: "X-RAY Unit", count: 4, image: mriSystem },
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* MRI Machines Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">MRI Machines</h2>
            <a href="#" className="text-accent hover:underline font-medium">View All</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>

        {/* Mobile & Portable Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Mobile & Portable</h2>
            <a href="#" className="text-accent hover:underline font-medium">Browse All MRI Machines</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mobileCategories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ name, count, image }: { name: string; count: number | null; image: string }) => (
  <a 
    href="#"
    className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-card hover:border-accent/30 transition-all group"
  >
    <div className="h-24 mb-4 flex items-center justify-center">
      <img 
        src={image} 
        alt={name}
        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
      />
    </div>
    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{name}</h3>
    {count !== null && (
      <span className="text-muted-foreground text-sm">({count})</span>
    )}
  </a>
);

export default EquipmentCategories;
