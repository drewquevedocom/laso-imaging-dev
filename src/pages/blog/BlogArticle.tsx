import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getBlogArticleBySlug, blogArticles } from '@/data/blogArticles';
import { Calendar, Clock, ArrowLeft, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteForm from '@/components/shared/QuoteForm';

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getBlogArticleBySlug(slug) : null;

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
            <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
            <Link to="/blog" className="text-accent hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get related articles (same category, different article)
  const relatedArticles = blogArticles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);

  // Simple markdown-to-html conversion for headings and paragraphs
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ').trim();
        if (text) {
          elements.push(
            <p key={elements.length} className="text-muted-foreground mb-4 leading-relaxed">
              {text.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : part
              )}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">
            {listItems.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold text-foreground mt-8 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold text-foreground mt-6 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        flushParagraph();
        inList = true;
        listItems.push(trimmedLine.replace('- ', ''));
      } else if (trimmedLine === '') {
        flushParagraph();
        if (!inList) flushList();
      } else {
        if (inList) flushList();
        currentParagraph.push(trimmedLine);
      }
    });

    flushParagraph();
    flushList();

    return elements;
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | LASO Imaging Solutions</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <link rel="canonical" href={`https://lasoimaging.com/blog/${article.slug}`} />
        
        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "author": {
              "@type": "Organization",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "LASO Imaging Solutions"
            },
            "datePublished": article.publishDate,
            "keywords": article.keywords.join(', ')
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-secondary border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <section className="bg-primary py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded mb-4 capitalize">
                {article.category.replace('-', ' ')}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.publishDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <article className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  {renderContent(article.content)}
                </div>

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">Share this article:</span>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Quote Form */}
                  <QuoteForm
                    sourcePage={`Blog: ${article.title}`}
                    variant="sidebar"
                    title="Get Expert Help"
                    subtitle="Have questions about this topic? Our team is here to help."
                  />

                  {/* Related Articles */}
                  {relatedArticles.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedArticles.map((related) => (
                          <Link 
                            key={related.slug}
                            to={`/blog/${related.slug}`}
                            className="block group"
                          >
                            <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {related.readTime}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BlogArticle;
