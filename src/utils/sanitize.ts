import validator from 'validator';

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  // Escape HTML entities and trim whitespace
  return validator.escape(validator.trim(input));
}

/**
 * Sanitizes an object's string properties recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map((item: any) =>
          typeof item === 'string' ? sanitizeString(item) :
          typeof item === 'object' && item !== null ? sanitizeObject(item) :
          item
        ) as any;
      } else {
        sanitized[key] = sanitizeObject(sanitized[key]);
      }
    }
  }
  
  return sanitized;
}
