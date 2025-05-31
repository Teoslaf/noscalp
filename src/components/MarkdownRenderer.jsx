import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeMarkdown } from '../utils/markdownUtils';

/**
 * MarkdownRenderer Component
 * 
 * Renders Markdown content with consistent styling that matches the design system.
 * Used for event descriptions and other rich text content.
 * 
 * Props:
 * - content: Markdown string to render
 * - className: Additional CSS classes (optional)
 * - fallback: Fallback content if markdown is empty (optional)
 */
const MarkdownRenderer = ({ content, className = '', fallback = null }) => {
  // Handle empty or invalid content
  if (!content || typeof content !== 'string') {
    if (fallback) {
      return <div className={className}>{fallback}</div>;
    }
    return null;
  }

  // Clean up content - remove excessive newlines
  const cleanContent = content.trim().replace(/\n{3,}/g, '\n\n');

  // Custom components for styling Markdown elements
  const components = {
    // Headers
    h1: ({ children }) => (
      <h1 className="text-section-header font-bold text-text-primary mb-md">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-body font-bold text-text-primary mb-sm">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-body font-medium text-text-primary mb-sm">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-caption font-medium text-text-primary mb-xs">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-caption font-medium text-text-secondary mb-xs">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-small font-medium text-text-muted mb-xs">
        {children}
      </h6>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="text-body text-text-secondary mb-md leading-relaxed last:mb-0">
        {children}
      </p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="text-body text-text-secondary mb-md ml-lg space-y-xs list-none">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="text-body text-text-secondary mb-md ml-lg space-y-xs list-decimal">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="relative">
        <span className="absolute -left-lg text-primary-green font-bold">•</span>
        <span>{children}</span>
      </li>
    ),

    // Strong and emphasis
    strong: ({ children }) => (
      <strong className="font-medium text-text-primary">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-text-primary">
        {children}
      </em>
    ),

    // Links
    a: ({ href, children }) => (
      <a 
        href={href}
        className="text-primary-green hover:text-primary-green-hover underline transition-colors duration-fast"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Code
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="px-xs py-0.5 bg-bg-tertiary text-text-primary rounded text-small font-mono">
            {children}
          </code>
        );
      }
      // Block code
      return (
        <pre className="y p-md rounded-md overflow-x-auto mb-md">
          <code className="text-small text-text-primary font-mono">
            {children}
          </code>
        </pre>
      );
    },

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-green pl-lg py-sm bg-bg-tertiary rounded-r-md mb-md">
        <div className="text-body text-text-secondary italic">
          {children}
        </div>
      </blockquote>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="border-border-primary my-lg" />
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto mb-md">
        <table className="w-full border-collapse border border-border-primary rounded-md">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-bg-secondary">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-border-primary">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="text-left p-sm text-caption font-medium text-text-primary">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="p-sm text-caption text-text-secondary">
        {children}
      </td>
    ),
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {sanitizeMarkdown(cleanContent)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 