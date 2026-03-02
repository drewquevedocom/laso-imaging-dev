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
    description: 'Leading supplier of used and refurbished MRI, CT, and medical imaging equipment with nationwide service, parts, and support.',
    url: 'https://lasoimaging.com',
    telephone: '+1-844-511-5276',
    email: 'info@lasoimaging.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '14900 Magnolia Blvd #56323',
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
    '@id': 'https://lasoimaging.com/#local-business',
    ...baseBusinessInfo,
    image: 'https://lasoimaging.com/og-image.jpg',
    logo: 'https://lasoimaging.com/logo-laso.png',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'MRI systems',
      'CT scanners', 
      'Medical imaging equipment',
      'Refurbished medical equipment',
      'MRI parts and coils',
      'Helium refills',
      'Equipment installation'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Medical Imaging Equipment',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'MRI Systems',
          itemListElement: ['1.5T MRI', '3.0T MRI', 'Open MRI', 'Mobile MRI'],
        },
        {
          '@type': 'OfferCatalog',
          name: 'CT Scanners',
          itemListElement: ['64-Slice CT', '128-Slice CT', 'Mobile CT'],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Parts & Components',
          itemListElement: ['MRI Coils', 'Gradient Amplifiers', 'Cold Heads', 'Compressors'],
        },
      ],
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://lasoimaging.com/#organization',
    name: 'LASO Imaging Solutions',
    alternateName: 'LASO Imaging',
    url: 'https://lasoimaging.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://lasoimaging.com/logo-laso.png',
      width: 300,
      height: 60,
    },
    image: 'https://lasoimaging.com/og-image.jpg',
    description: baseBusinessInfo.description,
    telephone: baseBusinessInfo.telephone,
    email: baseBusinessInfo.email,
    address: baseBusinessInfo.address,
    foundingDate: '2015',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 50,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-844-511-5276',
        contactType: 'sales',
        areaServed: 'US',
        availableLanguage: ['English', 'Spanish'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+1-844-511-5276',
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: 'English',
      },
    ],
    sameAs: baseBusinessInfo.sameAs,
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://lasoimaging.com/#website',
    name: 'LASO Imaging Solutions',
    alternateName: 'LASO Imaging',
    url: 'https://lasoimaging.com',
    description: 'Your trusted partner for used and refurbished MRI, CT, and medical imaging equipment.',
    publisher: {
      '@id': 'https://lasoimaging.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://lasoimaging.com/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
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
