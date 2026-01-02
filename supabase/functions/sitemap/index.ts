import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

// Site domain - update this to your production domain
const SITE_DOMAIN = 'https://lasoimaging.lovable.app';

// Shopify configuration
const SHOPIFY_STORE_DOMAIN = '4nxsp2-kf.myshopify.com';
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STOREFRONT_TOKEN = '4851d3a2a4db49349aa5166a5cfa42d3';

// Static pages with their priorities
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/products', priority: '0.9', changefreq: 'daily' },
  { url: '/quote', priority: '0.8', changefreq: 'monthly' },
  { url: '/faqs', priority: '0.6', changefreq: 'monthly' },
  { url: '/track-order', priority: '0.5', changefreq: 'monthly' },
  { url: '/signup', priority: '0.6', changefreq: 'monthly' },
  // Equipment categories
  { url: '/equipment/1-5t-mri-systems', priority: '0.9', changefreq: 'weekly' },
  { url: '/equipment/3t-mri-systems', priority: '0.9', changefreq: 'weekly' },
  { url: '/equipment/open-mri-systems', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/mobile-mri-systems', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/extremity-mri', priority: '0.7', changefreq: 'weekly' },
  { url: '/equipment/refurbished', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/used', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/certified-pre-owned', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/new', priority: '0.8', changefreq: 'weekly' },
  // Brand pages
  { url: '/equipment/brand/ge', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/brand/siemens', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/brand/philips', priority: '0.8', changefreq: 'weekly' },
  { url: '/equipment/brand/canon', priority: '0.7', changefreq: 'weekly' },
  { url: '/equipment/brand/hitachi', priority: '0.7', changefreq: 'weekly' },
  // Services
  { url: '/services', priority: '0.8', changefreq: 'monthly' },
  { url: '/services/installation', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/relocation', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/maintenance', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/mobile-rental', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/training', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/helium', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/consulting', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/financing', priority: '0.7', changefreq: 'monthly' },
  // Parts
  { url: '/parts', priority: '0.8', changefreq: 'weekly' },
  { url: '/parts/rf-coils', priority: '0.7', changefreq: 'weekly' },
  { url: '/parts/mri-parts', priority: '0.7', changefreq: 'weekly' },
  { url: '/parts/ct-parts', priority: '0.7', changefreq: 'weekly' },
  { url: '/parts/brand/ge', priority: '0.7', changefreq: 'weekly' },
  { url: '/parts/brand/siemens', priority: '0.7', changefreq: 'weekly' },
  { url: '/parts/brand/philips', priority: '0.7', changefreq: 'weekly' },
  // Support
  { url: '/support/documentation', priority: '0.6', changefreq: 'monthly' },
  { url: '/support/warranty', priority: '0.6', changefreq: 'monthly' },
  { url: '/support/service-request', priority: '0.6', changefreq: 'monthly' },
];

// Fetch all products from Shopify
async function fetchAllProducts(): Promise<string[]> {
  const productHandles: string[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  while (hasNextPage) {
    try {
      const response: Response = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query,
            variables: { first: 250, after: cursor },
          }),
        }
      );

      if (!response.ok) {
        console.error('Shopify API error:', response.status);
        break;
      }

      const data: { data?: { products?: { pageInfo: { hasNextPage: boolean; endCursor: string }; edges: Array<{ node: { handle: string } }> } }; errors?: unknown[] } = await response.json();
      
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        break;
      }

      const products = data.data?.products;
      if (products) {
        for (const edge of products.edges) {
          productHandles.push(edge.node.handle);
        }
        hasNextPage = products.pageInfo.hasNextPage;
        cursor = products.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      hasNextPage = false;
    }
  }

  return productHandles;
}

// Generate XML sitemap
function generateSitemap(productHandles: string[]): string {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_DOMAIN}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // Add product pages
  for (const handle of productHandles) {
    xml += `  <url>
    <loc>${SITE_DOMAIN}/product/${handle}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += '</urlset>';
  return xml;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating sitemap...');
    
    // Fetch all product handles from Shopify
    const productHandles = await fetchAllProducts();
    console.log(`Found ${productHandles.length} products`);

    // Generate the sitemap XML
    const sitemap = generateSitemap(productHandles);

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap with just static pages on error
    const fallbackSitemap = generateSitemap([]);
    
    return new Response(fallbackSitemap, {
      headers: corsHeaders,
      status: 200,
    });
  }
});
