import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import MarkdownContent from '@/components/shared/MarkdownContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { searchProductsByType, ShopifyProduct } from '@/lib/shopify';
import { getEquipmentContent, EquipmentCategoryContent } from '@/data/equipmentContent';
import { Loader2, FileText, Eye, Phone, MessageCircle } from 'lucide-react';

const EquipmentCategory = () => {
  const { category } = useParams<{ category: string }>();
  const content = category ? getEquipmentContent(category) : null;
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!content) return;
      
      try {
        const shopifyProducts = await searchProductsByType(content.searchQuery, 20);
        setProducts(shopifyProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [content]);

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

  const formatPriceRange = (low: number, high: number) => {
    return `$${low.toLocaleString()} - $${high.toLocaleString()}`;
  };

  // Breadcrumb items for schema
  const breadcrumbItems = content ? [
    { name: 'Home', url: 'https://lasoimaging.com/' },
    { name: 'Equipment', url: 'https://lasoimaging.com/products' },
    { name: content.title, url: `https://lasoimaging.com/equipment/${category}` },
  ] : [];

  if (!content) {
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
        title={content.metaTitle}
        description={content.metaDescription}
        keywords={content.keywords}
        canonical={`/equipment/${category}`}
        type="product"
      />
      <FAQSchema faqs={content.faqs} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      
      <main>
        {/* Breadcrumb Navigation */}
        <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/products" className="hover:text-accent">Equipment</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-foreground font-medium">{content.title}</li>
          </ol>
        </nav>

        {/* Hero Section with Answer Capsule */}
        <section className="bg-primary py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              {content.title}
            </h1>
            {/* Answer Capsule - 40-60 word summary for AI search */}
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-4xl leading-relaxed">
              {content.answerCapsule}
            </p>
          </div>
        </section>

        {/* Brand Filters */}
        {content.brands.length > 0 && (
          <section className="border-b border-border bg-secondary/30">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground mr-2">Filter by Brand:</span>
                <Link to={`/products?query=${encodeURIComponent(content.searchQuery)}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    All Brands
                  </Button>
                </Link>
                {content.brands.map((brand) => (
                  <Link 
                    key={brand} 
                    to={`/products?vendor=${encodeURIComponent(brand)}&query=${encodeURIComponent(content.searchQuery)}`}
                  >
                    <Button variant="outline" size="sm" className="text-xs">
                      {brand}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-muted-foreground">
                    {products.length} systems available
                  </p>
                  <Link to="/quote">
                    <Button variant="default" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Request Quote
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.node.id}
                      className="overflow-hidden hover:shadow-lg transition-all group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.node.images.edges[0]?.node.url || '/placeholder.svg'}
                          alt={product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <CardContent className="p-4">
                        <h3 className="text-md font-bold text-foreground mb-1 line-clamp-2">
                          {product.node.title}
                        </h3>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-w-3xl mx-auto text-center py-12">
                <div className="bg-secondary rounded-lg p-12 mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Contact Us for Availability
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    We're updating our {content.title.toLowerCase()} listings. Contact us for current availability and pricing.
                  </p>
                  <Link to={`/quote?interest=${encodeURIComponent(content.title)}`}>
                    <Button variant="default" size="lg">
                      Request Equipment Quote
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-accent/10 py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Ready to find your next system?</h3>
              <p className="text-muted-foreground">Our experts are here to help you find the perfect equipment.</p>
            </div>
            <div className="flex gap-4">
              <Link to={`/quote?interest=${encodeURIComponent(content.title)}`}>
                <Button variant="default" size="lg">
                  Request a Quote
                </Button>
              </Link>
              <a href="tel:18445115276">
                <Button variant="outline" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  (844) 511-5276
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Extended Description Section - 500+ words */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <MarkdownContent content={content.description} />
            </div>
          </div>
        </section>

        {/* Price Ranges Table */}
        {content.priceRanges.length > 0 && (
          <section className="py-12 md:py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {content.title} Pricing Guide
                </h2>
                <p className="text-muted-foreground mb-8">
                  Prices for {content.title.toLowerCase()} vary based on model year, condition, features, and market conditions. 
                  Below are typical price ranges for popular models. Contact us for current pricing on specific systems.
                </p>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Model</th>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Price Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.priceRanges.map((range, index) => (
                        <tr 
                          key={range.type} 
                          className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}
                        >
                          <td className="px-6 py-4 text-foreground">{range.type}</td>
                          <td className="px-6 py-4 text-accent font-semibold">
                            {formatPriceRange(range.low, range.high)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  * Prices are estimates and subject to change. Actual pricing depends on system condition, 
                  configuration, and market availability. Contact us for a personalized quote.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {content.faqs.length > 0 && (
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {content.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-foreground hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Find Your {content.title.split(' ')[0]} System?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Our team of experts is ready to help you find the perfect equipment for your facility. 
              Get a personalized quote or speak with a specialist today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/quote?interest=${encodeURIComponent(content.title)}`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Request a Quote
                </Button>
              </Link>
              <a href="tel:18445115276">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Phone className="w-4 h-4 mr-2" />
                  Call (844) 511-5276
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EquipmentCategory;
