import { Helmet } from 'react-helmet-async';

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  sku?: string;
  price?: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  condition?: 'NewCondition' | 'RefurbishedCondition' | 'UsedCondition';
  url?: string;
  category?: string;
}

const ProductSchema = ({
  name,
  description,
  image,
  brand,
  sku,
  price,
  priceCurrency = 'USD',
  availability = 'InStock',
  condition = 'RefurbishedCondition',
  url,
  category,
}: ProductSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    ...(image && { image }),
    ...(brand && {
      brand: {
        '@type': 'Brand',
        name: brand,
      },
    }),
    ...(sku && { sku }),
    ...(category && { category }),
    ...(url && { url }),
    itemCondition: `https://schema.org/${condition}`,
    offers: {
      '@type': 'Offer',
      availability: `https://schema.org/${availability}`,
      ...(price && {
        price: price.toString(),
        priceCurrency,
      }),
      ...(!price && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency,
        },
      }),
      seller: {
        '@type': 'Organization',
        name: 'LASO Imaging Solutions',
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ProductSchema;
