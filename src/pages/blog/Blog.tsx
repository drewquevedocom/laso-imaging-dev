import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { blogArticles, getBlogArticlesByCategory } from '@/data/blogArticles';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { value: 'all', label: 'All Articles' },
  { value: 'buying-guide', label: 'Buying Guides' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'industry-news', label: 'Industry News' },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredArticles = getBlogArticlesByCategory(activeCategory);

  return (
    <>
      <Helmet>
        <title>Medical Imaging Resources & Blog | LASO Imaging Solutions</title>
        <meta 
          name="description" 
          content="Expert insights on MRI equipment, maintenance best practices, buying guides, and industry news from LASO Imaging Solutions." 
        />
        <meta name="keywords" content="MRI blog, medical imaging resources, MRI buying guide, MRI maintenance, healthcare equipment news" />
        <link rel="canonical" href="https://lasoimaging.com/blog" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-accent mb-4">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Resources</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Medical Imaging Insights
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Expert guides, maintenance tips, and industry news to help you make informed decisions about your imaging equipment.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-4">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === category.value
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article 
                  key={article.slug}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    <span className="absolute top-3 left-3 z-20 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded capitalize">
                      {article.category.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.publishDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      <Link to={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <Link 
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                    >
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need Expert Guidance?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team of medical imaging specialists is ready to help you make the best decisions for your facility.
            </p>
            <Link to="/quote">
              <Button variant="cta" size="lg">
                Request a Consultation
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
