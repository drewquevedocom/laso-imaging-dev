import { Helmet } from 'react-helmet-async';

interface ArticleSchemaProps {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url?: string;
  keywords?: string[];
}

const ArticleSchema = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = 'LASO Imaging Solutions',
  url,
  keywords,
}: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    ...(image && { image }),
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://lasoimaging.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LASO Imaging Solutions',
      url: 'https://lasoimaging.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lasoimaging.com/logo-laso.png',
      },
    },
    ...(url && { mainEntityOfPage: { '@type': 'WebPage', '@id': url } }),
    ...(keywords && { keywords: keywords.join(', ') }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ArticleSchema;
