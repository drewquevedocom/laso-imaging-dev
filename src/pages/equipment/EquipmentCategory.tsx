import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { searchProductsByType, ShopifyProduct } from '@/lib/shopify';
import { Loader2, FileText, Eye, CheckCircle2 } from 'lucide-react';

const equipmentData: Record<string, { title: string; description: string; metaDescription: string; keywords: string[]; searchQuery: string }> = {
  '1-5t-mri-systems': {
    title: '1.5T MRI Systems for Sale',
    description: 'Browse our selection of certified pre-owned 1.5T MRI systems from leading manufacturers.',
    metaDescription: 'Buy 1.5T MRI systems from GE, Siemens, and Philips. FDA registered dealer with certified pre-owned equipment and nationwide delivery.',
    keywords: ['1.5T MRI', '1.5 Tesla MRI', 'refurbished MRI', 'MRI for sale'],
    searchQuery: '1.5T'
  },
  '3t-mri-systems': {
    title: '3.0T MRI Systems for Sale',
    description: 'High-field 3T MRI systems for advanced clinical and research applications.',
    metaDescription: 'Buy 3T MRI systems. High-field imaging from GE, Siemens, and Philips with comprehensive warranty.',
    keywords: ['3T MRI', '3 Tesla MRI', 'high-field MRI', 'research MRI'],
    searchQuery: '3T'
  },
  'open-mri-systems': {
    title: 'Open MRI Systems for Sale',
    description: 'Patient-friendly open MRI systems for claustrophobic and bariatric patients.',
    metaDescription: 'Open MRI systems for sale. Patient-friendly imaging solutions from Hitachi, Siemens, and Philips.',
    keywords: ['open MRI', 'open bore MRI', 'claustrophobic MRI', 'bariatric MRI'],
    searchQuery: 'Open MRI'
  },
  'extremity-mri': {
    title: 'Extremity MRI Systems',
    description: 'Dedicated extremity MRI systems for orthopedic imaging.',
    metaDescription: 'Extremity MRI systems for orthopedic practices. Dedicated imaging for hands, wrists, knees, and feet.',
    keywords: ['extremity MRI', 'orthopedic MRI', 'dedicated MRI', 'ONI MSK'],
    searchQuery: 'Extremity'
  },
  'mobile-mri-systems': {
    title: 'Mobile MRI Systems for Sale',
    description: 'Mobile MRI trailers and systems for temporary or permanent installations.',
    metaDescription: 'Mobile MRI systems and trailers for sale. Complete mobile imaging solutions with installation support.',
    keywords: ['mobile MRI', 'MRI trailer', 'portable MRI', 'mobile imaging'],
    searchQuery: 'Mobile'
  },
  'refurbished': {
    title: 'Refurbished MRI Equipment',
    description: 'Quality refurbished MRI systems with comprehensive warranty and support.',
    metaDescription: 'Refurbished MRI systems from FDA registered dealer. Quality pre-owned equipment at competitive prices.',
    keywords: ['refurbished MRI', 'used MRI', 'pre-owned MRI', 'reconditioned MRI'],
    searchQuery: 'MRI'
  },
  'used': {
    title: 'Used MRI Systems',
    description: 'Pre-owned MRI systems inspected and tested for reliable performance.',
    metaDescription: 'Used MRI systems for sale. Inspected and tested equipment from trusted manufacturers.',
    keywords: ['used MRI', 'pre-owned MRI', 'second-hand MRI', 'MRI equipment'],
    searchQuery: 'MRI'
  },
  'certified-pre-owned': {
    title: 'Certified Pre-Owned MRI',
    description: 'Certified pre-owned MRI systems with extended warranty coverage.',
    metaDescription: 'Certified pre-owned MRI systems with warranty. Thoroughly inspected and certified by our engineers.',
    keywords: ['certified pre-owned MRI', 'CPO MRI', 'warranty MRI', 'certified MRI'],
    searchQuery: 'MRI'
  },
  'new': {
    title: 'New MRI Equipment',
    description: 'New MRI systems from authorized dealer partners.',
    metaDescription: 'New MRI systems from GE, Siemens, and Philips. Authorized dealer with factory support.',
    keywords: ['new MRI', 'new MRI system', 'MRI purchase', 'buy MRI'],
    searchQuery: 'MRI'
  },
};

const EquipmentCategory = () => {
  const { category } = useParams<{ category: string }>();
  const equipment = category ? equipmentData[category] : null;
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!equipment) return;
      
      try {
        const shopifyProducts = await searchProductsByType(equipment.searchQuery, 20);
        setProducts(shopifyProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [equipment]);

  const formatPrice = (amount: string, currencyCode: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount === 0) return "Contact for Pricing";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  if (!equipment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
            <Link to="/products" className="text-accent hover:underline">
              View All Equipment
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={equipment.title}
        description={equipment.metaDescription}
        keywords={equipment.keywords}
        canonical={`/equipment/${category}`}
        type="product"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {equipment.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {equipment.description}
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : products.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-8">{products.length} systems available</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.node.id}
                      className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.node.images.edges[0]?.node.url || '/placeholder.svg'}
                          alt={product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="text-md font-bold text-foreground mb-1 line-clamp-2">{product.node.title}</h3>
                        <p className="text-accent font-bold text-lg mb-2">
                          {formatPrice(
                            product.node.priceRange.minVariantPrice.amount,
                            product.node.priceRange.minVariantPrice.currencyCode
                          )}
                        </p>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.node.description?.slice(0, 80) || 'Quality medical imaging equipment.'}
                        </p>

                        <div className="flex gap-2">
                          <Link to={`/quote?product=${encodeURIComponent(product.node.title)}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              Quote
                            </Button>
                          </Link>
                          <Link to={`/product/${product.node.handle}`} className="flex-1">
                            <Button variant="default" size="sm" className="w-full text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-w-3xl mx-auto text-center">
                <div className="bg-secondary rounded-lg p-12 mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">No Products Found</h2>
                  <p className="text-muted-foreground mb-6">
                    We're updating our {equipment.title.toLowerCase()} listings. Contact us for current availability.
                  </p>
                  <Link to="/quote?interest=Equipment">
                    <Button variant="default" size="lg">
                      Request Equipment Quote
                    </Button>
                  </Link>
                </div>
                <Link to="/products" className="text-accent hover:underline">
                  ← Back to All Equipment
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EquipmentCategory;
