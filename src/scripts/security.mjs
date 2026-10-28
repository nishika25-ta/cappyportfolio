const ALLOWED_SERVICE_IDS = Object.freeze(['websites', 'portfolios', 'resumes', 'food']);
const ALLOWED_SHOWCASE_IDS = Object.freeze(['websites', 'business', 'pro', 'portfolios', 'resumes', 'food']);
const ALLOWED_VIDEO_TYPES = Object.freeze(['video/mp4', 'video/webm', 'video/quicktime']);
const SAFE_VIDEO_PATH_RE = /^\/videos\/[a-zA-Z0-9_-]+\.(mp4|webm|mov)$/i;
const SAFE_ARTWORK_PATH_RE = /^\/artwork\/[a-zA-Z0-9_-]+\.(webp|png|jpg|jpeg)$/i;
const SAFE_HASH_RE = /^#[a-zA-Z0-9_-]{1,64}$/;
const CONTROL_AND_BIDI_RE = /[\u0000-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069<>]/g;

/**
 * Recursively freezes an object or array in place to prevent runtime tampering
 * or prototype-pollution mutation of configuration data.
 */
export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) {
      deepFreeze(value[key]);
    }
  }
  return value;
}

/**
 * Strips HTML angle brackets, ASCII/Unicode control characters, and bidi overrides,
 * then collapses whitespace and enforces a strict maximum length.
 */
export function sanitizePlainText(input, maxLength = 120) {
  if (typeof input !== 'string') return '';
  return input
    .replace(CONTROL_AND_BIDI_RE, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes a phone number into E.164 digits only (8-15 digits),
 * falling back to the default studio number if invalid.
 */
export function sanitizePhoneDigits(rawPhone, fallback = '60178478597') {
  if (typeof rawPhone !== 'string') return fallback;
  const digits = rawPhone.replace(/\D+/g, '');
  return /^\d{8,15}$/.test(digits) ? digits : fallback;
}

/**
 * Escapes special HTML characters to prevent XSS in HTML contexts.
 */
export function escapeHtml(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escapes special XML characters to prevent XML injection in sitemaps/feeds.
 */
export function escapeXml(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Safely serializes data for embedding inside <script type="application/ld+json">.
 * Escapes <, >, &, ', and line separators so "</script>" or HTML comments can never
 * break out of the script element and execute arbitrary JavaScript.
 */
export function safeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Validates and normalizes SITE_URL.
 * Only permits https:// URLs (or http://localhost / http://127.0.0.1 for local testing),
 * strips credentials, query parameters, and hashes.
 */
export function sanitizeSiteUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return undefined;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.username || parsed.password) return undefined;
    const isLocalHttp =
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');
    if (parsed.protocol !== 'https:' && !isLocalHttp) return undefined;
    parsed.search = '';
    parsed.hash = '';
    return parsed.href;
  } catch {
    return undefined;
  }
}

/**
 * Strictly validates service tab/character identifiers against an allowlist.
 */
export function isAllowedServiceId(id) {
  return typeof id === 'string' && ALLOWED_SERVICE_IDS.includes(id);
}

/**
 * Strictly validates showcase category identifiers against an allowlist.
 */
export function isAllowedShowcaseId(id) {
  return typeof id === 'string' && ALLOWED_SHOWCASE_IDS.includes(id);
}

/**
 * Validates in-page anchor hashes before history.pushState or DOM lookup.
 */
export function isSafeAnchorHash(hash) {
  return typeof hash === 'string' && SAFE_HASH_RE.test(hash);
}

/**
 * Validates video playback URLs to prevent XSS/SSRF/external media injection.
 * Only allows relative paths in /videos/ with safe extensions, or blob: URLs for local preview.
 */
export function isAllowedVideoSource(src, isLocalBlob = false) {
  if (typeof src !== 'string' || !src) return false;
  if (isLocalBlob) {
    return src.startsWith('blob:') && !/[\u0000-\u001F\s<>]/.test(src);
  }
  if (src.includes('..') || src.startsWith('//')) return false;
  return SAFE_VIDEO_PATH_RE.test(src);
}

/**
 * Validates artwork/poster image URLs to prevent XSS/external image injection.
 * Only allows relative paths in /artwork/ with safe image extensions.
 */
export function isAllowedArtworkSource(src) {
  if (typeof src !== 'string' || !src) return false;
  if (src.includes('..') || src.startsWith('//')) return false;
  return SAFE_ARTWORK_PATH_RE.test(src);
}

/**
 * Validates a user-selected local video File before creating an object URL.
 */
export function validateVideoFile(file, maxBytes = 200 * 1024 * 1024) {
  if (!file || typeof file !== 'object') {
    return { valid: false, reason: 'Please choose an MP4, WebM or MOV video.' };
  }
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { valid: false, reason: 'Please choose an MP4, WebM or MOV video.' };
  }
  if (typeof file.size === 'number' && (file.size <= 0 || file.size > maxBytes)) {
    return { valid: false, reason: 'Video file must be under 200 MB.' };
  }
  return { valid: true, safeName: sanitizePlainText(file.name || 'preview', 80) };
}
