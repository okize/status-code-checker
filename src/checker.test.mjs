import { describe, it, expect } from 'vitest';
import { checkUrls, checkUrl } from './checker.mjs';

describe('checkUrl', () => {
  it('should handle a single valid URL', async () => {
    const result = await checkUrl('https://example.com');
    expect(result).toHaveProperty('url', 'https://example.com');
    expect(result).toHaveProperty('status');
    expect(typeof result.status).toBe('number');
  });

  it('should handle connection errors gracefully', async () => {
    const result = await checkUrl('https://this-does-not-exist.mock');
    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('error');
    expect(typeof result.error).toBe('string');
  });
});

describe('checkUrls', () => {
  it('should check multiple URLs concurrently', async () => {
    const urls = ['https://example.com', 'https://github.com'];
    const results = await checkUrls(urls);
    
    expect(results).toHaveLength(2);
    results.forEach(result => {
      expect(result).toHaveProperty('url');
      expect(result).toMatchObject({
        status: expect.any(Number),
      });
    });
  });

  it('should add https protocol if missing', async () => {
    const results = await checkUrls(['example.com']);
    expect(results[0].url).toContain('https://');
  });
});
