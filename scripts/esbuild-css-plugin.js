#!/usr/bin/env node
/**
 * esbuild CSS-as-String Plugin
 * 
 * Intercepts CSS file imports and returns their content as JavaScript string exports.
 * This enables web components to import CSS files and use the content inline in
 * shadow DOM <style> tags, avoiding external CSS file dependencies in browser bundles.
 * 
 * This approach matches industry standards used by Lit, Shoelace, and other
 * web component libraries.
 * 
 * @example
 * // In a web component:
 * import buttonStyles from './ButtonCTA.web.css';
 * 
 * // Use in shadow DOM:
 * this._shadowRoot.innerHTML = `
 *   <style>${buttonStyles}</style>
 *   <button>...</button>
 * `;
 * 
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 8.2 (components render correctly)
 */

const fs = require('fs');
const path = require('path');

/**
 * Create the CSS-as-string plugin for esbuild.
 * 
 * The plugin intercepts all .css file imports and transforms them into
 * JavaScript modules that export the CSS content as a string.
 * 
 * @param {Object} options - Plugin options
 * @param {boolean} [options.minify=false] - Whether to minify CSS content
 * @returns {Object} esbuild plugin object
 */
function cssAsStringPlugin(options = {}) {
  const { minify = false } = options;
  
  return {
    name: 'css-as-string',
    
    setup(build) {
      // Intercept .css file imports
      build.onResolve({ filter: /\.css$/ }, (args) => {
        // Resolve the CSS file path relative to the importer
        const resolvedPath = path.resolve(path.dirname(args.importer), args.path);
        
        return {
          path: resolvedPath,
          namespace: 'css-as-string'
        };
      });
      
      // Load CSS files and return as JS string export
      build.onLoad({ filter: /.*/, namespace: 'css-as-string' }, async (args) => {
        try {
          // Read the CSS file content
          let cssContent = await fs.promises.readFile(args.path, 'utf8');
          
          // Optionally minify the CSS
          if (minify) {
            cssContent = minifyCSS(cssContent);
          }
          
          // Escape backticks and backslashes for template literal
          const escapedContent = cssContent
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$');
          
          // Return as JavaScript module exporting the CSS string
          return {
            contents: `export default \`${escapedContent}\`;`,
            loader: 'js'
          };
        } catch (error) {
          return {
            errors: [{
              text: `Failed to load CSS file: ${error.message}`,
              location: { file: args.path }
            }]
          };
        }
      });
    }
  };
}

/**
 * Basic CSS minification.
 * 
 * Performs simple minification by removing comments, extra whitespace,
 * and newlines. For production builds, consider using a more robust
 * minifier like cssnano.
 * 
 * @param {string} css - CSS content to minify
 * @returns {string} Minified CSS
 */
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove newlines and extra whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around special characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons before closing braces
    .replace(/;}/g, '}')
    // Trim leading/trailing whitespace
    .trim();
}

module.exports = { cssAsStringPlugin, minifyCSS };
