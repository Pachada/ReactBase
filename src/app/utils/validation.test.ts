import { isValidEmail, sanitizeInput } from '@/app/utils/validation';

describe('validation utilities', () => {
  test('sanitizeInput trims and caps input', () => {
    expect(sanitizeInput('   hello world   ', 5)).toBe('hello');
  });

  test('isValidEmail validates common email format', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('bad-email')).toBe(false);
  });
});
