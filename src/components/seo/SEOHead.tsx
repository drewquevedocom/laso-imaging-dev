import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  type?: 'website' | 'product' | 'service' | 'article';
  image?: string;
  noIndex?: boolean;
}

const SEOHead = ({
  title,
  description,
  keywords = [],
  canonical,
  type = 'website',
  image = '/og-image.jpg',
  noIndex = false,
}: SEOHeadProps) => {
  const siteUrl = 'https://lasoimaging.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;
  const fullTitle = `${title} | LASO Imaging Solutions`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="US-CA" />
      <meta name="geo.placename" content="Sherman Oaks" />
      <meta name="geo.position" content="34.1547;-118.4485" />
      <meta name="ICBM" content="34.1547, -118.4485" />

      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:site_name" content="LASO Imaging Solutions" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
    </Helmet>
  );
};

export default SEOHead;
