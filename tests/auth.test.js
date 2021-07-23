/* eslint-disable no-undef */
const { isValidEmail, isValidPassword } = require('../src/auth/validate-credentials');

test('password of length 6 should be invalid', () => {
  const shortPassword = 'one2#';
  expect(isValidPassword(shortPassword)).toBe(false);
});

test('password of length 21 should be invalid', () => {
  const longPassword = 'HereIsMYSUPER94@#LONG';
  expect(isValidPassword(longPassword)).toBe(false);
});

test('password without letters should be invalid', () => {
  const noLetterPassword = '12341!@#$!@#';
  expect(isValidPassword(noLetterPassword)).toBe(false);
});

test('password without numbers should be invalid', () => {
  const noNumberPassword = 'asdf!@#$';
  expect(isValidPassword(noNumberPassword)).toBe(false);
});

test('password without symbols should be invalid', () => {
  const noSymbolPassword = 'asdf1234';
  expect(isValidPassword(noSymbolPassword)).toBe(false);
});

test('password with letters, numbers, and symbols should be valid', () => {
  const validPassword = 'password12#$';
  expect(isValidPassword(validPassword)).toBe(true);
});

test('malformed email should be invalid', () => {
  const badEmail = 'noahgmail.com';
  expect(isValidEmail(badEmail)).toBe(false);
});

test('well formed email should be valid', () => {
  const goodEmail = 'noah@gmail.com';
  expect(isValidEmail(goodEmail)).toBe(true);
});
