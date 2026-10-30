import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  escapeHtml,
  escapeXml,
  isAllowedArtworkSource,
  isAllowedServiceId,
  isAllowedShowcaseId,
  isAllowedVideoSource,
  isSafeAnchorHash,
  safeJsonLd,
  sanitizePhoneDigits,
  sanitizePlainText,
  sanitizeSiteUrl,
  validateVideoFile
} from '../src/scripts/security.mjs';
import { enquiryUrl, faqs, services, site } from '../src/data/site.mjs';

test('safeJsonLd prevents </script> breakout and HTML comment XSS inside JSON-LD blocks', () => {
  const payload = {
    name: '</script><script>alert("xss")</script>',
    note: '<!-- malicious comment --> & \'quotes\''
  };
  const serialized = safeJsonLd(payload);
  assert.equal(serialized.includes('</script>'), false);
  assert.equal(serialized.includes('<script>'), false);
  assert.equal(serialized.includes('<!--'), false);
  assert.match(serialized, /\\u003c\/script\\u003e/);
  assert.deepEqual(JSON.parse(serialized), payload);
});

test('sanitizePlainText strips HTML tags, control chars, and bidi overrides', () => {
  const dirty = '  <img src=x onerror=alert(1)>Kitty\u0000\u202EStarter\r\n ';
  assert.equal(sanitizePlainText(dirty), 'img src=x onerror=alert(1)KittyStarter');
  assert.equal(sanitizePlainText(null), '');
  assert.equal(sanitizePlainText('A'.repeat(200), 20).length, 20);
});

test('escapeHtml and escapeXml neutralize angle brackets, quotes, and ampersands', () => {
  const attack = `<script src="https://evil.test/x.js">'&'</script>`;
  assert.equal(
    escapeHtml(attack),
    '&lt;script src=&quot;https://evil.test/x.js&quot;&gt;&#39;&amp;&#39;&lt;/script&gt;'
  );
  assert.equal(
    escapeXml(attack),
    '&lt;script src=&quot;https://evil.test/x.js&quot;&gt;&apos;&amp;&apos;&lt;/script&gt;'
  );
});

test('sanitizeSiteUrl blocks javascript:, data:, insecure HTTP, and embedded credentials', () => {
  assert.equal(sanitizeSiteUrl('javascript:alert(1)'), undefined);
  assert.equal(sanitizeSiteUrl('data:text/html,<script>alert(1)</script>'), undefined);
  assert.equal(sanitizeSiteUrl('http://example.com'), undefined);
  assert.equal(sanitizeSiteUrl('https://admin:secret@example.com/path'), undefined);
  assert.equal(sanitizeSiteUrl('https://cappythedev.com/?token=123#frag'), 'https://cappythedev.com/');
  assert.equal(sanitizeSiteUrl('http://localhost:4400/'), 'http://localhost:4400/');
});

test('enquiryUrl sanitizes malicious package names and rejects invalid prices', () => {
  const url = new URL(enquiryUrl('<script>alert(1)</script>Kitty', -999));
  assert.equal(url.protocol, 'https:');
  assert.equal(url.hostname, 'wa.me');
  const text = url.searchParams.get('text') ?? '';
  assert.equal(text.includes('<script>'), false);
  assert.equal(text.includes('-999'), false);
});

test('sanitizePhoneDigits enforces E.164 numeric format and rejects injection strings', () => {
  assert.equal(sanitizePhoneDigits('+60 17-847 8597'), '60178478597');
  assert.equal(sanitizePhoneDigits('javascript:alert(1)', '60178478597'), '60178478597');
  assert.equal(sanitizePhoneDigits('123', '60178478597'), '60178478597');
});

test('allowlist validators block DOM selector injection and unsafe video URLs', () => {
  assert.equal(isAllowedServiceId('websites'), true);
  assert.equal(isAllowedServiceId('websites"],body,[data-x="'), false);
  assert.equal(isAllowedShowcaseId('pro'), true);
  assert.equal(isAllowedShowcaseId('<svg onload=alert(1)>'), false);
  assert.equal(isSafeAnchorHash('#pricing-websites'), true);
  assert.equal(isSafeAnchorHash('#<img src=x onerror=alert(1)>'), false);

  assert.equal(isAllowedVideoSource('/videos/kitty-starter.mp4', false), true);
  assert.equal(isAllowedVideoSource('/memes/meme-1.mp4', false), true);
  assert.equal(isAllowedVideoSource('javascript:alert(1)', false), false);
  assert.equal(isAllowedVideoSource('https://evil.example/video.mp4', false), false);
  assert.equal(isAllowedVideoSource('//evil.example/video.mp4', false), false);
  assert.equal(isAllowedVideoSource('/videos/../../secret.mp4', false), false);
  assert.equal(isAllowedVideoSource('/memes/../../secret.mp4', false), false);
  assert.equal(isAllowedVideoSource('blob:https://example.com/1234-5678', true), true);
  assert.equal(isAllowedVideoSource('javascript:alert(1)', true), false);

  assert.equal(isAllowedArtworkSource('/artwork/portfolios.webp'), true);
  assert.equal(isAllowedArtworkSource('/memes/meme-1.jpg'), true);
  assert.equal(isAllowedArtworkSource('/artwork/portfolio-price.webp'), true);
  assert.equal(isAllowedArtworkSource('javascript:alert(1)'), false);
  assert.equal(isAllowedArtworkSource('https://evil.example/poster.webp'), false);
  assert.equal(isAllowedArtworkSource('/artwork/../../secret.webp'), false);

  assert.equal(validateVideoFile({ type: 'video/mp4', size: 1024, name: 'demo.mp4' }).valid, true);
  assert.equal(validateVideoFile({ type: 'text/html', size: 1024, name: 'xss.html' }).valid, false);
  assert.equal(validateVideoFile({ type: 'video/mp4', size: 999_999_999, name: 'huge.mp4' }).valid, false);
});

test('exported site, services, and faqs data are deeply frozen against runtime tampering', () => {
  assert.equal(Object.isFrozen(site), true);
  assert.equal(Object.isFrozen(services), true);
  assert.equal(Object.isFrozen(services[0]), true);
  assert.equal(Object.isFrozen(services[0].packages), true);
  assert.equal(Object.isFrozen(services[0].packages[0]), true);
  assert.equal(Object.isFrozen(faqs), true);
  assert.throws(() => {
    services[0].packages[0].price = 0;
  }, TypeError);
});

test('CORS, CSP, and security headers are configured in vercel.json and public/_headers', () => {
  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const globalRule = vercel.headers.find(h => h.source === '/(.*)');
  assert.ok(globalRule, 'Missing global header rule in vercel.json');
  const headerMap = Object.fromEntries(globalRule.headers.map(h => [h.key, h.value]));

  assert.match(headerMap['Content-Security-Policy'], /default-src 'self'/);
  assert.match(headerMap['Content-Security-Policy'], /script-src 'self'/);
  assert.match(headerMap['Content-Security-Policy'], /object-src 'none'/);
  assert.match(headerMap['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.equal(headerMap['X-Content-Type-Options'], 'nosniff');
  assert.equal(headerMap['X-Frame-Options'], 'DENY');
  assert.equal(headerMap['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(headerMap['Cross-Origin-Opener-Policy'], 'same-origin-allow-popups');
  assert.equal(headerMap['Cross-Origin-Resource-Policy'], 'same-origin');
  assert.equal(headerMap['Cross-Origin-Embedder-Policy'], undefined);
  assert.equal(headerMap['Access-Control-Allow-Credentials'], 'false');
  assert.equal(headerMap['Access-Control-Allow-Origin'], undefined, 'Must not set wildcard CORS *');

  const netlifyHeaders = fs.readFileSync('public/_headers', 'utf8');
  assert.match(netlifyHeaders, /Content-Security-Policy:/);
  assert.match(netlifyHeaders, /Cross-Origin-Resource-Policy: same-origin/);
  assert.match(netlifyHeaders, /X-Content-Type-Options: nosniff/);
});

test('source code has no dangerous DOM XSS sinks, leaked secrets, or unsafe target=_blank links', () => {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(gitignore, /^\*\.key$/m);
  assert.match(gitignore, /^\*\.pem$/m);

  const walk = dir =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    });

  const sourceFiles = walk('src').filter(f => /\.(astro|ts|mjs|js)$/.test(f));
  const dangerousSinkRe = /\b(innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval)\s*[=(]/;
  const secretTokenRe = /\b(AIza[0-9A-Za-z-_]{35}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]+)\b/;

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.equal(dangerousSinkRe.test(content), false, `Dangerous DOM sink found in ${file}`);
    assert.equal(secretTokenRe.test(content), false, `Potential API secret found in ${file}`);
    if (file.endsWith('.astro')) {
      const blankTargets = [...content.matchAll(/target="_blank"/g)];
      for (const match of blankTargets) {
        const snippet = content.slice(Math.max(0, match.index - 120), match.index + 120);
        assert.match(snippet, /rel="noopener noreferrer"/, `Missing rel="noopener noreferrer" in ${file}`);
      }
    }
  }

  if (fs.existsSync('dist')) {
    const distFiles = walk('dist');
    const sourceMaps = distFiles.filter(f => f.endsWith('.map'));
    assert.deepEqual(sourceMaps, [], 'Production build must not expose .map source maps');
    const builtTextFiles = distFiles.filter(f => /\.(js|mjs|html|xml|css)$/.test(f));
    const bundleLeakRe =
      /\b(AIza[0-9A-Za-z-_]{35}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]+|-----BEGIN [A-Z ]+ PRIVATE KEY-----|process\.env\.[A-Z0-9_]+)\b/;
    for (const builtFile of builtTextFiles) {
      const builtContent = fs.readFileSync(builtFile, 'utf8');
      assert.equal(
        bundleLeakRe.test(builtContent),
        false,
        `Potential secret or raw process.env reference leaked in built bundle: ${builtFile}`
      );
    }
    for (const htmlFile of ['dist/index.html', 'dist/about/index.html', 'dist/404.html']) {
      if (fs.existsSync(htmlFile)) {
        const html = fs.readFileSync(htmlFile, 'utf8');
        assert.match(html, /http-equiv="Content-Security-Policy"/);
        assert.match(html, /http-equiv="X-Content-Type-Options" content="nosniff"/);
        assert.match(html, /name="referrer" content="strict-origin-when-cross-origin"/);
      }
    }
  }
});
