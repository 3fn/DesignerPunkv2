/**
 * Test Setup for TextInputField Component
 * 
 * This file registers the TextInputField web component before tests run.
 * It ensures the component is available in the JSDOM environment for testing.
 */

// Import the web component to trigger registration
import '../platforms/web/TextInputField.web';

// The web component is automatically registered when the module is imported
// via the customElements.define() call at the end of TextInputField.web.ts
