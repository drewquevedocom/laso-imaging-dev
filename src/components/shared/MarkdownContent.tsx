import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Simple markdown renderer for SEO content descriptions
 * Handles H2, H3, paragraphs, lists, bold text
 */
const MarkdownContent = ({ content, className = '' }: MarkdownContentProps) => {
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
            {currentList.map((item, i) => (
              <li key={i}>{parseInlineContent(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        flushList();
        return;
      }

      // H2 headers
      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
        return;
      }

      // H3 headers
      if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
        return;
      }

      // List items
      if (trimmedLine.startsWith('- ')) {
        currentList.push(trimmedLine.replace('- ', ''));
        return;
      }

      // Regular paragraphs
      flushList();
      elements.push(
        <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
          {parseInlineContent(trimmedLine)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  const parseInlineContent = (text: string): React.ReactNode => {
    // Parse bold text (**text**)
    const parts: React.ReactNode[] = [];
    const regex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      // Add the bold text
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {parseContent(content)}
    </div>
  );
};

export default MarkdownContent;
