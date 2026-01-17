import { toast } from "sonner";
import { logger } from "@/lib/logger";

// Shopify Storefront API Configuration
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '4nxsp2-kf.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!SHOPIFY_STOREFRONT_TOKEN) {
  logger.error('VITE_SHOPIFY_STOREFRONT_TOKEN is not set in environment variables');
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

// Storefront API helper function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active Shopify billing plan.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// GraphQL Queries
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

// Paginated query with cursor support for fetching all products
const PAGINATED_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String, $after: String) {
    products(first: $first, query: $query, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Fetch products from Shopify (single page, limited to 250)
export async function fetchShopifyProducts(first: number = 250, query?: string): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query });
    if (!data) return [];
    return data.data?.products?.edges || [];
  } catch (error) {
    logger.error('Error fetching Shopify products:', error);
    return [];
  }
}

// Fetch ALL products from Shopify using cursor-based pagination
export async function fetchAllShopifyProducts(query?: string): Promise<ShopifyProduct[]> {
  const allProducts: ShopifyProduct[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
      const data = await storefrontApiRequest(PAGINATED_PRODUCTS_QUERY, { 
        first: 250, 
        query, 
        after: cursor 
      });
      
      if (!data?.data?.products) break;
      
      allProducts.push(...data.data.products.edges);
      hasNextPage = data.data.products.pageInfo.hasNextPage;
      cursor = data.data.products.pageInfo.endCursor;
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching all Shopify products:', error);
    return allProducts; // Return what we have so far
  }
}

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

// Fetch single product by handle
export async function fetchShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    if (!data || !data.data?.productByHandle) return null;
    return { node: data.data.productByHandle };
  } catch (error) {
    console.error('Error fetching Shopify product by handle:', error);
    return null;
  }
}

// Create checkout from cart items
export async function createStorefrontCheckout(items: Array<{ variantId: string; quantity: number }>): Promise<string> {
  const lines = items.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines },
  });

  if (!cartData) {
    throw new Error('Failed to create cart');
  }

  if (cartData.data.cartCreate.userErrors.length > 0) {
    throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  const cart = cartData.data.cartCreate.cart;
  
  if (!cart.checkoutUrl) {
    throw new Error('No checkout URL returned from Shopify');
  }

  const url = new URL(cart.checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}

// Search products by product type (e.g., "1.5T MRI Systems", "3.0T MRI Systems")
export async function searchProductsByType(productType: string, first?: number): Promise<ShopifyProduct[]> {
  try {
    const query = `product_type:"${productType}"`;
    const products = await fetchAllShopifyProducts(query);
    return first ? products.slice(0, first) : products;
  } catch (error) {
    console.error('Error searching products by type:', error);
    return [];
  }
}

// Search products by vendor (e.g., "GE Healthcare", "Siemens Healthineers")
export async function searchProductsByVendor(vendor: string, first?: number): Promise<ShopifyProduct[]> {
  try {
    const query = `vendor:"${vendor}"`;
    const products = await fetchAllShopifyProducts(query);
    return first ? products.slice(0, first) : products;
  } catch (error) {
    console.error('Error searching products by vendor:', error);
    return [];
  }
}
