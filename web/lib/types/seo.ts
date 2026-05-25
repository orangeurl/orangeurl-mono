/**
 * SEO Type Definitions
 * Centralized types for SEO-related data structures
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  canonical?: string;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface SchemaBase {
  '@context': string;
  '@type': string;
}

export interface OrganizationSchema extends SchemaBase {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: ContactPoint;
  sameAs?: string[];
  address?: PostalAddress;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  contactType: string;
  email?: string;
  telephone?: string;
  availableLanguage?: string[];
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  addressCountry: string;
  addressLocality?: string;
  postalCode?: string;
}

export interface ArticleSchema extends SchemaBase {
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: Person | Organization;
  publisher: Organization;
}

export interface Person {
  '@type': 'Person';
  name: string;
  url?: string;
}

export interface Organization {
  '@type': 'Organization';
  name: string;
  logo?: ImageObject;
}

export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
}

export interface ProductSchema extends SchemaBase {
  '@type': 'Product';
  name: string;
  description: string;
  image: string;
  offers: Offer;
  aggregateRating?: AggregateRating;
}

export interface Offer {
  '@type': 'Offer';
  price: string;
  priceCurrency: string;
  availability: string;
}

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: string;
  ratingCount: string;
  bestRating: string;
  worstRating: string;
}

export interface FAQSchema extends SchemaBase {
  '@type': 'FAQPage';
  mainEntity: Question[];
}

export interface Question {
  '@type': 'Question';
  name: string;
  acceptedAnswer: Answer;
}

export interface Answer {
  '@type': 'Answer';
  text: string;
}

export interface HowToSchema extends SchemaBase {
  '@type': 'HowTo';
  name: string;
  description: string;
  image: string;
  totalTime: string;
  step: HowToStep[];
}

export interface HowToStep {
  '@type': 'HowToStep';
  name: string;
  text: string;
  image?: string;
}

export interface BreadcrumbListSchema extends SchemaBase {
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

export interface ListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface InternalLinkData {
  href: string;
  text: string;
  title?: string;
  category: string;
  priority: number;
}

export interface SEOAnalysis {
  titleValid: boolean;
  titleLength: number;
  descriptionValid: boolean;
  descriptionLength: number;
  keywordsCount: number;
  hasCanonical: boolean;
  hasOgImage: boolean;
  hasSchema: boolean;
  score: number;
  suggestions: string[];
}

