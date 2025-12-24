/**
 * Jest Style Mock
 * 
 * Mocks CSS file imports for Jest tests. When web components import CSS files
 * as strings (for browser bundle compatibility), Jest needs to handle these
 * imports. This mock returns an empty string, which is sufficient for most
 * tests since they focus on component behavior rather than styling.
 * 
 * For tests that need to verify CSS content, use the actual CSS file content
 * or create specific test fixtures.
 * 
 * @see jest.config.js moduleNameMapper configuration
 * @see src/types/css.d.ts for TypeScript declaration
 * @see scripts/esbuild-css-plugin.js for build-time transformation
 * @see Requirements: 8.2, 8.3 (components render correctly in browser bundles)
 */

module.exports = '';
