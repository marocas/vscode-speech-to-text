/**
 * Utilities for handling developer-specific text transformations
 */

const DEVELOPER_TERMS = new Set([
  'javascript',
  'typescript',
  'python',
  'react',
  'vue',
  'angular',
  'node',
  'mongodb',
  'postgresql',
  'supabase',
  'vercel',
  'api',
  'sdk',
  'http',
  'rest',
  'websocket',
  'async',
  'await',
  'promise',
  'callback',
  'middleware',
  'router',
  'controller',
  'service',
  'component',
  'hook',
  'state',
  'reducer',
  'middleware',
]);

const ACRONYMS =
  /\b(API|SDK|HTTP|URL|REST|JSON|XML|SQL|CSS|HTML|DOM|UI|UX|PWA|SPA|MVP|IDE|CLI|CI|CD|DB|VM|VCS|SSH|TLS|SSL|JWT|CORS|CSRF|XSS|CDN|AWS|GCP|CI|CD)\b/gi;

/**
 * Convert text to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

/**
 * Convert text to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Convert text to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Identify if text contains developer terms and suggest proper formatting
 */
export function analyzeDeveloperText(text: string): {
  hasDeveloperTerms: boolean;
  suggestedFormat: 'camelCase' | 'snake_case' | 'PascalCase' | 'lowercase' | 'uppercase';
  foundTerms: string[];
} {
  const words = text.toLowerCase().split(/[\s_-]+/);
  const foundTerms = words.filter((word) => DEVELOPER_TERMS.has(word));

  // Suggest format based on context
  let suggestedFormat: 'camelCase' | 'snake_case' | 'PascalCase' | 'lowercase' | 'uppercase' =
    'lowercase';

  if (words.length > 1 && foundTerms.length > 0) {
    // If multiple words with dev terms, suggest camelCase
    suggestedFormat = 'camelCase';
  }

  return {
    hasDeveloperTerms: foundTerms.length > 0,
    suggestedFormat,
    foundTerms,
  };
}

/**
 * Apply developer-smart corrections to transcribed text
 */
export function applyDeveloperCorrections(
  text: string,
  _customDictionary: Map<string, string> = new Map()
): string {
  let corrected = text;

  // Handle acronyms
  corrected = corrected.replace(ACRONYMS, (match) => match.toUpperCase());

  // Apply custom dictionary fixes
  _customDictionary.forEach((replacement, original) => {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    corrected = corrected.replace(regex, replacement);
  });

  return corrected;
}

/**
 * Detect programming language patterns
 */
export function detectCodePattern(text: string): string {
  if (/async|await|promise|callback/.test(text.toLowerCase())) return 'javascript';
  if (/def |lambda|class /.test(text)) return 'python';
  if (/func |protocol |let /.test(text)) return 'swift';
  if (/fun |lateinit|\?/.test(text)) return 'kotlin';
  if (/@interface|@implementation|NSString/.test(text)) return 'objc';
  if (/const |let |var |function/.test(text)) return 'javascript';

  return 'unknown';
}
