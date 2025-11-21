import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-white prose-code:text-pink-400 prose-pre:bg-surface prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;