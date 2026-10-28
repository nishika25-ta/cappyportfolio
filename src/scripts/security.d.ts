export function deepFreeze<T>(value: T): T;
export function sanitizePlainText(input: unknown, maxLength?: number): string;
export function sanitizePhoneDigits(rawPhone: unknown, fallback?: string): string;
export function escapeHtml(input: unknown): string;
export function escapeXml(input: unknown): string;
export function safeJsonLd(data: unknown): string;
export function sanitizeSiteUrl(rawUrl: unknown): string | undefined;
export function isAllowedServiceId(id: unknown): id is 'websites' | 'portfolios' | 'resumes' | 'food';
export function isAllowedShowcaseId(id: unknown): id is 'websites' | 'business' | 'pro' | 'portfolios' | 'resumes' | 'food';
export function isSafeAnchorHash(hash: unknown): hash is string;
export function isAllowedVideoSource(src: unknown, isLocalBlob?: boolean): boolean;
export function validateVideoFile(
  file: File | null | undefined,
  maxBytes?: number
): { valid: boolean; reason?: string; safeName?: string };
