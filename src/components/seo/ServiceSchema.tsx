import { Helmet } from 'react-helmet-async';

interface ServiceSchemaProps {
  name: string;
  description: string;
  url?: string;
  image?: string;
  areaServed?: string[];
  priceRange?: string;
  serviceType?: string;
}

const ServiceSchema = ({
  name,
  description,
  url,
  image,
  areaServed = ['United States'],
  priceRange = '$$$',
  serviceType,
}: ServiceSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    ...(url && { url }),
    ...(image && { image }),
    ...(serviceType && { serviceType }),
    provider: {
      '@type': 'Organization',
      name: 'LASO Imaging Solutions',
      url: 'https://lasoimaging.com',
      telephone: ['+1-818-916-9503', '+1-800-674-5276'],
      email: 'info@lasoimaging.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '14900 Magnolia Blvd #5442',
        addressLocality: 'Sherman Oaks',
        addressRegion: 'CA',
        postalCode: '91413',
        addressCountry: 'US',
      },
    },
    areaServed: areaServed.map((area) => ({
      '@type': 'Country',
      name: area,
    })),
    priceRange,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ServiceSchema;
