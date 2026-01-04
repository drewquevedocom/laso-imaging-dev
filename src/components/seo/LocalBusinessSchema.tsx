import { Helmet } from 'react-helmet-async';

interface LocalBusinessSchemaProps {
  pageType?: 'LocalBusiness' | 'MedicalBusiness';
}

const LocalBusinessSchema = ({ pageType = 'LocalBusiness' }: LocalBusinessSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: 'LASO Imaging Solutions',
    description: 'FDA registered dealer of refurbished MRI, CT, and X-Ray medical imaging equipment. Sales, service, parts, and rentals nationwide.',
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.1547,
      longitude: -118.4485,
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'State', name: 'California' },
    ],
    priceRange: '$$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/laso-imaging',
      'https://www.facebook.com/lasoimaging',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
