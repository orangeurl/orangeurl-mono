/**
 * Internal Links Component
 * Displays related links for better SEO and user navigation
 */

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getRelatedLinks, getContextualLinks, InternalLink } from '@/lib/seo/internalLinks';

interface InternalLinksProps {
  currentPath: string;
  category?: string;
  keywords?: string[];
  limit?: number;
  title?: string;
  variant?: 'card' | 'list' | 'grid';
}

export function InternalLinks({
  currentPath,
  category,
  keywords = [],
  limit = 5,
  title = 'Related Pages',
  variant = 'grid',
}: InternalLinksProps) {
  // Get relevant links based on context
  const links = keywords.length > 0
    ? getContextualLinks(keywords, currentPath, limit)
    : getRelatedLinks(currentPath, category, limit);

  if (links.length === 0) return null;

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                title={link.title}
                className="flex items-center text-primary hover:underline group"
              >
                <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="grid gap-3">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                title={link.title}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <span className="font-medium">{link.text}</span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            title={link.title}
            className="group"
          >
            <Card className="h-full card-hover border-2 hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {link.text}
                  </h4>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
                {link.title && (
                  <p className="text-sm text-muted-foreground mt-auto">
                    {link.title}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Breadcrumb Component
 */
interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />
            )}
            {index === items.length - 1 ? (
              <span className="font-medium text-foreground">{item.name}</span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Footer Links Component
 */
interface FooterLinksProps {
  sections: Record<string, InternalLink[]>;
}

export function FooterLinks({ sections }: FooterLinksProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Object.entries(sections).map(([title, links]) => (
        <div key={title}>
          <h4 className="font-semibold mb-4">{title}</h4>
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  title={link.title}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * CTA Links Component - Strategic placement for SEO
 */
interface CTALinksProps {
  links: InternalLink[];
  title?: string;
  description?: string;
}

export function CTALinks({ links, title, description }: CTALinksProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl p-8 md:p-12">
      <div className="text-center space-y-6">
        {title && <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>}
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              title={link.title}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {link.text}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

