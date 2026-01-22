import { Helmet } from 'react-helmet-async';

interface LocalBusinessSchemaProps {
  pageType?: 'LocalBusiness' | 'MedicalBusiness';
  includeOrganization?: boolean;
  includeWebSite?: boolean;
}

const LocalBusinessSchema = ({ 
  pageType = 'LocalBusiness',
  includeOrganization = false,
  includeWebSite = false,
}: LocalBusinessSchemaProps) => {
  const baseBusinessInfo = {
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

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': pageType,
    ...baseBusinessInfo,
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LASO Imaging Solutions',
    url: 'https://lasoimaging.com',
    logo: 'https://lasoimaging.com/logo-laso.png',
    description: 'FDA registered dealer of refurbished MRI, CT, and X-Ray medical imaging equipment.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-818-916-9503',
      contactType: 'sales',
      areaServed: 'US',
      availableLanguage: ['English', 'Spanish'],
    },
    address: baseBusinessInfo.address,
    sameAs: baseBusinessInfo.sameAs,
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LASO Imaging Solutions',
    url: 'https://lasoimaging.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://lasoimaging.com/products?query={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemas: any[] = [localBusinessSchema];
  if (includeOrganization) schemas.push(organizationSchema);
  if (includeWebSite) schemas.push(webSiteSchema);

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default LocalBusinessSchema;
