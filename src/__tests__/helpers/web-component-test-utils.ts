/**
 * Web Component Test Utilities
 *
 * Workarounds for jsdom quirks with custom elements:
 * 1. innerHTML = '' destroys the custom element registry — use cleanupDOM() instead
 * 2. ES module side-effect imports don't reliably register elements — use ensureRegistered()
 *
 * @see .kiro/issues/2026-04-01-web-component-test-registration.md
 */

/**
 * Safely remove all child nodes from document.body without destroying
 * jsdom's custom element registry.
 *
 * DO NOT use `document.body.innerHTML = ''` in jsdom tests — it breaks
 * customElements.define() for subsequent createElement() calls.
 */
export function cleanupDOM(): void {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
}

/**
 * Ensure web components are registered in the current jsdom environment.
 * Idempotent — skips registration if the tag is already defined.
 *
 * @param components - Array of { tag, path } where tag is the custom element
 *   name and path is the require() path to the module that calls customElements.define()
 */
export function ensureRegistered(
  ...components: Array<{ tag: string; path: string }>
): void {
  for (const { tag, path } of components) {
    if (!customElements.get(tag)) {
      require(path);
    }
  }
}
