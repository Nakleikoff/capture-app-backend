import { describe, expect, it } from 'vitest';
import { sanitizeObject, sanitizeString } from '../../utils/sanitize.js';

describe('sanitizeString', () => {
  it('should escape HTML entities', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;';
    expect(sanitizeString(input)).toBe(expected);
  });

  it('should trim whitespace', () => {
    const input = '  hello world  ';
    const expected = 'hello world';
    expect(sanitizeString(input)).toBe(expected);
  });

  it('should escape and trim together', () => {
    const input = '  <b>Bold text</b>  ';
    const expected = '&lt;b&gt;Bold text&lt;&#x2F;b&gt;';
    expect(sanitizeString(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('should handle strings with special characters', () => {
    const input = "'; DROP TABLE users; --";
    const expected = '&#x27;; DROP TABLE users; --';
    expect(sanitizeString(input)).toBe(expected);
  });

  it('should escape ampersands', () => {
    const input = 'Ben & Jerry';
    const expected = 'Ben &amp; Jerry';
    expect(sanitizeString(input)).toBe(expected);
  });

  it('should return empty string for non-string input', () => {
    expect(sanitizeString(123 as any)).toBe('');
    expect(sanitizeString(null as any)).toBe('');
    expect(sanitizeString(undefined as any)).toBe('');
  });
});

describe('sanitizeObject', () => {
  it('should sanitize all string properties', () => {
    const input = {
      name: '<script>alert("XSS")</script>',
      email: 'test@example.com',
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe(
      '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;',
    );
    expect(result.email).toBe('test@example.com');
  });

  it('should preserve non-string properties', () => {
    const input = {
      name: 'John',
      age: 30,
      active: true,
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe('John');
    expect(result.age).toBe(30);
    expect(result.active).toBe(true);
  });

  it('should handle nested objects', () => {
    const input = {
      user: {
        name: '<b>Bold</b>',
        profile: {
          bio: '<script>XSS</script>',
        },
      },
    };
    const result = sanitizeObject(input);
    expect(result.user.name).toBe('&lt;b&gt;Bold&lt;&#x2F;b&gt;');
    expect(result.user.profile.bio).toBe(
      '&lt;script&gt;XSS&lt;&#x2F;script&gt;',
    );
  });

  it('should handle arrays of strings', () => {
    const input = {
      tags: ['<tag1>', 'tag2', '<tag3>'],
    };
    const result = sanitizeObject(input);
    expect(result.tags).toEqual(['&lt;tag1&gt;', 'tag2', '&lt;tag3&gt;']);
  });

  it('should handle arrays of objects', () => {
    const input = {
      items: [
        { name: '<item1>', value: 10 },
        { name: '<item2>', value: 20 },
      ],
    };
    const result = sanitizeObject(input);
    expect(result.items[0].name).toBe('&lt;item1&gt;');
    expect(result.items[0].value).toBe(10);
    expect(result.items[1].name).toBe('&lt;item2&gt;');
    expect(result.items[1].value).toBe(20);
  });

  it('should handle mixed arrays', () => {
    const input = {
      mixed: ['<string>', 123, true, null],
    };
    const result = sanitizeObject(input);
    expect(result.mixed[0]).toBe('&lt;string&gt;');
    expect(result.mixed[1]).toBe(123);
    expect(result.mixed[2]).toBe(true);
    expect(result.mixed[3]).toBe(null);
  });

  it('should handle null values', () => {
    const input = {
      name: 'John',
      email: null as any,
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe('John');
    expect(result.email).toBe(null);
  });

  it('should not mutate the original object', () => {
    const input = {
      name: '<script>alert("XSS")</script>',
    };
    const result = sanitizeObject(input);
    expect(input.name).toBe('<script>alert("XSS")</script>');
    expect(result.name).toBe(
      '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;',
    );
  });

  it('should handle complex nested structure', () => {
    const input = {
      user: {
        name: '  <b>John Doe</b>  ',
        comments: [
          { text: '<script>XSS</script>', votes: 5 },
          { text: 'Normal comment', votes: 10 },
        ],
        metadata: {
          tags: ['<tag1>', 'tag2'],
          settings: {
            theme: '<dark>',
          },
        },
      },
    };
    const result = sanitizeObject(input);
    expect(result.user.name).toBe('&lt;b&gt;John Doe&lt;&#x2F;b&gt;');
    expect(result.user.comments[0].text).toBe(
      '&lt;script&gt;XSS&lt;&#x2F;script&gt;',
    );
    expect(result.user.comments[0].votes).toBe(5);
    expect(result.user.comments[1].text).toBe('Normal comment');
    expect(result.user.metadata.tags[0]).toBe('&lt;tag1&gt;');
    expect(result.user.metadata.settings.theme).toBe('&lt;dark&gt;');
  });
});
