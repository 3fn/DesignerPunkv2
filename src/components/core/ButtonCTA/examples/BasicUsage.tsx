/**
 * Basic Usage Examples for ButtonCTA Component
 * 
 * This file demonstrates simple, common usage patterns for the ButtonCTA component.
 * Each example shows a different aspect of the component's basic functionality.
 * 
 * @module ButtonCTA/examples/BasicUsage
 */

import { ButtonCTA } from '../platforms/web/ButtonCTA.web';

/**
 * Example 1: Default Button (Medium, Primary)
 * 
 * The simplest usage with only required props. This demonstrates the default
 * button appearance with medium size and primary style.
 * 
 * Default values:
 * - size: 'medium' (48px height)
 * - style: 'primary' (filled background with primary color)
 * - noWrap: false (text wraps if needed)
 * - disabled: false (interactive)
 * 
 * @example
 * ```html
 * <button-cta label="Click me"></button-cta>
 * ```
 */
export function defaultButton(): void {
  const button = document.createElement('button-cta') as ButtonCTA;
  button.label = 'Click me';
  
  // Add event listener for button press
  button.addEventListener('press', () => {
    console.log('Default button clicked!');
  });
  
  document.body.appendChild(button);
}

/**
 * Example 2: Button with Custom Label
 * 
 * Demonstrates how to set a custom label text. The label should be concise
 * and action-oriented to clearly communicate the button's purpose.
 * 
 * Best practices for labels:
 * - Use action verbs (Save, Submit, Continue, Cancel)
 * - Keep it short (1-3 words)
 * - Be specific about the action
 * - Consider internationalization (text may be longer in other languages)
 * 
 * @example
 * ```html
 * <button-cta label="Save Changes"></button-cta>
 * ```
 */
export function customLabelButton(): void {
  const button = document.createElement('button-cta') as ButtonCTA;
  button.label = 'Save Changes';
  
  // Add event listener for button press
  button.addEventListener('press', () => {
    console.log('Save Changes button clicked!');
  });
  
  document.body.appendChild(button);
}

/**
 * Example 3: Button with onPress Handler
 * 
 * Demonstrates how to attach a click/press handler to respond to user interaction.
 * The handler is called when the button is clicked, tapped, or activated via
 * keyboard (Enter or Space key).
 * 
 * The 'press' event:
 * - Bubbles up through the DOM
 * - Is not called when button is disabled
 * - Works with click, tap, Enter key, and Space key
 * - Provides originalEvent in event.detail for advanced use cases
 * 
 * @example
 * ```typescript
 * const button = document.createElement('button-cta') as ButtonCTA;
 * button.label = 'Submit Form';
 * button.addEventListener('press', handleSubmit);
 * ```
 */
export function buttonWithHandler(): void {
  const button = document.createElement('button-cta') as ButtonCTA;
  button.label = 'Submit Form';
  
  // Define a handler function
  const handleSubmit = () => {
    console.log('Form submitted!');
    // In a real application, you would:
    // - Validate form data
    // - Send data to server
    // - Show success/error message
    // - Navigate to next page
  };
  
  // Attach the handler to the 'press' event
  button.addEventListener('press', handleSubmit);
  
  document.body.appendChild(button);
}

/**
 * Example 4: Disabled Button
 * 
 * Demonstrates how to disable a button to prevent user interaction.
 * Disabled buttons are commonly used during form submission, when prerequisites
 * aren't met, or when an action is temporarily unavailable.
 * 
 * Disabled button behavior:
 * - Not keyboard focusable (skipped in Tab order)
 * - Does not respond to clicks or keyboard activation
 * - Visual styling indicates non-interactive state
 * - Screen readers announce disabled state
 * - onPress handler is not called
 * 
 * Common use cases:
 * - Form submission in progress
 * - Required fields not filled
 * - User lacks permissions
 * - Action temporarily unavailable
 * 
 * @example
 * ```html
 * <button-cta label="Submit" disabled></button-cta>
 * ```
 * 
 * @example
 * ```typescript
 * // Conditional disable based on form state
 * const button = document.createElement('button-cta') as ButtonCTA;
 * button.label = 'Submit';
 * button.disabled = isSubmitting || !isFormValid;
 * ```
 */
export function disabledButton(): void {
  const button = document.createElement('button-cta') as ButtonCTA;
  button.label = 'Submit';
  button.disabled = true; // Button is non-interactive
  
  // This handler will NOT be called when button is disabled
  button.addEventListener('press', () => {
    console.log('This will not be logged when button is disabled');
  });
  
  document.body.appendChild(button);
  
  // Example: Enable button after 3 seconds (simulating async operation)
  setTimeout(() => {
    button.disabled = false;
    console.log('Button is now enabled');
  }, 3000);
}

/**
 * Example 5: All Examples Together
 * 
 * Demonstrates how to render all basic examples in a single container.
 * This is useful for testing and visual comparison of different button states.
 * 
 * @example
 * ```typescript
 * renderAllBasicExamples();
 * ```
 */
export function renderAllBasicExamples(): void {
  // Create container for examples
  const container = document.createElement('div');
  container.style.padding = '24px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '16px';
  
  // Example 1: Default button
  const defaultBtn = document.createElement('button-cta') as ButtonCTA;
  defaultBtn.label = 'Default Button';
  defaultBtn.addEventListener('press', () => console.log('Default clicked'));
  container.appendChild(defaultBtn);
  
  // Example 2: Custom label
  const customLabelBtn = document.createElement('button-cta') as ButtonCTA;
  customLabelBtn.label = 'Save Changes';
  customLabelBtn.addEventListener('press', () => console.log('Save clicked'));
  container.appendChild(customLabelBtn);
  
  // Example 3: With handler
  const handlerBtn = document.createElement('button-cta') as ButtonCTA;
  handlerBtn.label = 'Submit Form';
  handlerBtn.addEventListener('press', () => {
    console.log('Form submitted!');
    alert('Form submitted successfully!');
  });
  container.appendChild(handlerBtn);
  
  // Example 4: Disabled
  const disabledBtn = document.createElement('button-cta') as ButtonCTA;
  disabledBtn.label = 'Disabled Button';
  disabledBtn.disabled = true;
  disabledBtn.addEventListener('press', () => console.log('This will not log'));
  container.appendChild(disabledBtn);
  
  // Add container to document
  document.body.appendChild(container);
}

/**
 * Usage Instructions
 * 
 * To use these examples in your application:
 * 
 * 1. Import the example functions:
 *    ```typescript
 *    import { defaultButton, customLabelButton } from './examples/BasicUsage';
 *    ```
 * 
 * 2. Call the example function to render the button:
 *    ```typescript
 *    defaultButton(); // Renders default button
 *    ```
 * 
 * 3. Or render all examples at once:
 *    ```typescript
 *    import { renderAllBasicExamples } from './examples/BasicUsage';
 *    renderAllBasicExamples();
 *    ```
 * 
 * 4. For HTML usage (without TypeScript):
 *    ```html
 *    <button-cta label="Click me"></button-cta>
 *    <script>
 *      document.querySelector('button-cta').addEventListener('press', () => {
 *        console.log('Clicked!');
 *      });
 *    </script>
 *    ```
 */
