import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchShopifyProductByHandle } from "@/lib/shopify";
import geSignaHdxt from "@/assets/ge-signa-hdxt-15t.webp";
import ctScanner from "@/assets/ct-scanner.jpg";
import mobileMri from "@/assets/mobile-mri.jpg";

interface FeaturedSystem {
  id: string;
  handle: string;
  image: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  isMobile: boolean;
  isFeatured: boolean;
  useStaticImage?: boolean;
}

const staticSystems: FeaturedSystem[] = [
  {
    id: "ge-signa-hde-15t-mri-system",
    handle: "ge-signa-hde-15t-mri-system",
    image: geSignaHdxt,
    title: "GE Signa HDe 1.5T MRI System",
    price: "Contact for Pricing",
    description: "High-definition 1.5T MRI system with advanced imaging capabilities, proven reliability, and comprehensive coil packages available.",
    features: ["HD Imaging", "GE Signa Series", "90-Day Warranty"],
    isMobile: false,
    isFeatured: true,
    useStaticImage: true
  },
  {
    id: "siemens-magnetom-verio-30t",
    handle: "siemens-magnetom-verio-30t",
    image: ctScanner,
    title: "Siemens MAGNETOM Verio 3.0T",
    price: "Contact for Pricing",
    description: "Premium 3.0T MRI with exceptional image quality and advanced research capabilities for demanding clinical applications.",
    features: ["3.0T Field Strength", "70cm Open Bore", "Advanced Neuro"],
    isMobile: false,
    isFeatured: true
  },
  {
    id: "ge-15t-hdxt-16x16-channel-mri-2008-oshkosh-mobile",
    handle: "ge-15t-hdxt-16x16-channel-mri-2008-oshkosh-mobile",
    image: mobileMri,
    title: "2008 GE 1.5T 16X16 Channel Mobile MRI",
    price: "Contact for Pricing",
    description: "Complete turnkey mobile MRI solution with GE 1.5T system, climate control, and patient areas in an Oshkosh trailer.",
    features: ["GE 1.5T", "16x16 Channel", "Oshkosh Trailer"],
    isMobile: true,
    isFeatured: false
  }
];

const FeaturedSystems = () => {
  const [featuredSystems, setFeaturedSystems] = useState<FeaturedSystem[]>(staticSystems);

  useEffect(() => {
    const fetchProductImages = async () => {
      // Only fetch for items that don't use static images
      const handles = [
        "siemens-magnetom-verio-30t",
        "ge-15t-hdxt-16x16-channel-mri-2008-oshkosh-mobile"
      ];

      const fetchPromises = handles.map(handle => 
        fetchShopifyProductByHandle(handle).catch(error => {
          console.error(`Error fetching product ${handle}:`, error);
          return null;
        })
      );

      const products = await Promise.all(fetchPromises);
      
      setFeaturedSystems(prev => prev.map(system => {
        // Skip items that use static images
        if (system.useStaticImage) return system;
        
        const product = products.find(p => 
          p?.node?.handle === system.handle
        );
        if (product?.node?.images?.edges?.[0]?.node?.url) {
          return { ...system, image: product.node.images.edges[0].node.url };
        }
        return system;
      }));
    };

    fetchProductImages();
  }, []);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">Top Picks</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Featured MRI Systems</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Hand-selected equipment from our inventory, featuring certified pre-owned systems with warranty coverage.
            </p>
          </div>
          <Link to="/products?category=mri-systems">
            <Button variant="outline" className="group">
              View All Systems
              <Eye className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Systems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSystems.map((system) => (
            <div 
              key={system.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={system.image} 
                  alt={system.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {system.isFeatured && (
                    <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      FEATURED
                    </span>
                  )}
                  {system.isMobile && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      MOBILE
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-1">{system.title}</h3>
                <p className="text-accent font-bold text-xl mb-3">{system.price}</p>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{system.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {system.features.map((feature, i) => (
                    <span key={i} className="text-xs bg-secondary text-foreground px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex gap-2">
                  <Link to={`/quote?product=${encodeURIComponent(system.title)}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-1" />
                      Request Quote
                    </Button>
                  </Link>
                  <Link to={`/product/${system.handle}`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSystems;
