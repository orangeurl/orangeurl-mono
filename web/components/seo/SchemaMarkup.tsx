/**
 * Schema Markup Component
 * Adds structured data for rich snippets in search results
 */

import { schemaGenerators } from '@/lib/seo/metadata';

interface SchemaMarkupProps {
  schema: string;
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}

/**
 * Pre-built schema components for common use cases
 */

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  return <SchemaMarkup schema={schemaGenerators.breadcrumb(items)} />;
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
}) {
  return (
    <SchemaMarkup
      schema={schemaGenerators.article({
        title,
        description,
        url,
        image,
        datePublished,
        dateModified,
        author,
      })}
    />
  );
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency,
  availability,
}: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  availability: string;
}) {
  return (
    <SchemaMarkup
      schema={schemaGenerators.product({
        name,
        description,
        image,
        price,
        currency,
        availability,
      })}
    />
  );
}

export function FAQSchema({ items }: { items: Array<{ question: string; answer: string }> }) {
  return <SchemaMarkup schema={schemaGenerators.faq(items)} />;
}

export function HowToSchema({
  name,
  description,
  image,
  totalTime,
  steps,
}: {
  name: string;
  description: string;
  image: string;
  totalTime: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return (
    <SchemaMarkup
      schema={schemaGenerators.howTo({
        name,
        description,
        image,
        totalTime,
        steps,
      })}
    />
  );
}

