/**
 * SEO Library - Central Export
 * Easy access to all SEO utilities
 */

// Metadata generators
export {
  generateMetadata,
  generateSchema,
  schemaGenerators,
  keywordSets,
  generateKeywords,
} from './metadata';

// Internal linking
export {
  getRelatedLinks,
  getContextualLinks,
  getBreadcrumbs,
  getFooterLinks,
  getSitemapStructure,
  coreLinks,
  featureLinks,
  useCaseLinks,
  competitorLinks,
  resourceLinks,
} from './internalLinks';

// Programmatic data
export {
  generateProgrammaticItems,
  getProgrammaticItem,
  getProgrammaticItemBySlug,
  getAllProgrammaticSlugs,
  getItemsByCategory,
  categories,
  useCases,
  industries,
  platforms,
  competitors,
  locations,
  features,
  PROGRAMMATIC_TOTAL,
  SITEMAP_CHUNK_SIZE,
} from './programmaticData';

export type { ProgrammaticItem } from './programmaticData';
export type { InternalLink } from './internalLinks';

