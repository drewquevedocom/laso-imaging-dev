/**
 * HTML Sanitization utility using DOMPurify
 * Prevents XSS attacks by sanitizing HTML content before rendering
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The untrusted HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(
  dirty: string,
  options?: DOMPurify.Config
): string {
  return DOMPurify.sanitize(dirty, {
    // Default safe configuration
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false,
    ...options,
  });
}

/**
 * Create a sanitized object for dangerouslySetInnerHTML
 * @param dirty - The untrusted HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Object with __html property containing sanitized HTML
 */
export function createSanitizedHTML(
  dirty: string,
  options?: DOMPurify.Config
): { __html: string } {
  return { __html: sanitizeHTML(dirty, options) };
}
