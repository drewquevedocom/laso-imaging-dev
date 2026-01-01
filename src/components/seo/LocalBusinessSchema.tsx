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
    telephone: '+1-844-511-5276',
    email: 'info@lasoimaging.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Medical Center Drive',
      addressLocality: 'Houston',
      addressRegion: 'TX',
      postalCode: '77001',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.7604,
      longitude: -95.3698,
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'State', name: 'Texas' },
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
