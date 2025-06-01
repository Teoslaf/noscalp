/**
 * Markdown Utilities
 * 
 * Helper functions for working with Markdown content
 */

/**
 * Extracts plain text from Markdown content
 * Removes all Markdown formatting and returns clean text
 * 
 * @param {string} markdown - The Markdown content
 * @param {number} maxLength - Maximum length of extracted text (optional)
 * @returns {string} Plain text content
 */
export const extractPlainText = (markdown, maxLength = null) => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Remove Markdown formatting
  let plainText = markdown
    // Remove headers (# ## ###)
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic (**text** *text*)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove list markers (- * +)
    .replace(/^[•\-\*\+]\s+/gm, '')
    // Remove extra whitespace and newlines
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate if maxLength is specified
  if (maxLength && plainText.length > maxLength) {
    plainText = plainText.substring(0, maxLength).trim();
    // Try to break at word boundary
    const lastSpace = plainText.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      plainText = plainText.substring(0, lastSpace);
    }
    plainText += '...';
  }

  return plainText;
};

/**
 * Gets the first paragraph from Markdown content
 * Useful for previews and summaries
 * 
 * @param {string} markdown - The Markdown content
 * @returns {string} First paragraph as plain text
 */
export const getFirstParagraph = (markdown) => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Split by double newlines to get paragraphs
  const paragraphs = markdown.split(/\n\s*\n/);
  
  if (paragraphs.length === 0) {
    return '';
  }

  // Get first non-empty paragraph
  const firstParagraph = paragraphs.find(p => p.trim().length > 0);
  
  if (!firstParagraph) {
    return '';
  }

  // Extract plain text from the first paragraph
  return extractPlainText(firstParagraph);
};

/**
 * Checks if content contains Markdown formatting
 * 
 * @param {string} content - Content to check
 * @returns {boolean} True if content appears to be Markdown
 */
export const isMarkdown = (content) => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // Check for common Markdown patterns
  const markdownPatterns = [
    /^#+\s+/m,           // Headers
    /\*\*[^*]+\*\*/,     // Bold
    /\*[^*]+\*/,         // Italic
    /\[[^\]]+\]\([^)]+\)/, // Links
    /^[•\-\*\+]\s+/m,    // Lists
  ];

  return markdownPatterns.some(pattern => pattern.test(content));
};

/**
 * Sanitizes Markdown content for safe rendering
 * 
 * @param {string} markdown - Markdown content to sanitize
 * @returns {string} Sanitized Markdown
 */
export const sanitizeMarkdown = (markdown) => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Remove potentially harmful content
  return markdown
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event handlers
    .replace(/on\w+="[^"]*"/gi, '')
    // Clean up excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}; 