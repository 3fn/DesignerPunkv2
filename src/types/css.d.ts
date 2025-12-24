/**
 * TypeScript Declaration for CSS Module Imports
 * 
 * Enables TypeScript to understand CSS file imports that are transformed
 * by the esbuild CSS-as-string plugin into JavaScript string exports.
 * 
 * This declaration allows web components to import CSS files and use
 * the content inline in shadow DOM <style> tags.
 * 
 * @example
 * // Import CSS file (transformed to string by esbuild plugin)
 * import buttonStyles from './ButtonCTA.web.css';
 * 
 * // Use in shadow DOM
 * this._shadowRoot.innerHTML = `
 *   <style>${buttonStyles}</style>
 *   <button>...</button>
 * `;
 * 
 * @see scripts/esbuild-css-plugin.js
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 8.2 (components render correctly)
 */

declare module '*.css' {
  /**
   * CSS file content as a string.
   * 
   * When a CSS file is imported, the esbuild CSS-as-string plugin
   * transforms it into a JavaScript module that exports the CSS
   * content as a default string export.
   */
  const content: string;
  export default content;
}
