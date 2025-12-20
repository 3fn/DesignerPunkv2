/**
 * @category evergreen
 * @purpose Verify setup component renders correctly and behaves as expected
 * @jest-environment jsdom
 */
/**
 * Test infrastructure smoke test
 * 
 * Verifies that:
 * - Jest is configured correctly for web components
 * - Custom element registration works
 * - Shadow DOM rendering works
 * - Test utilities function correctly
 * 
 * Task 6.1: Set up test infrastructure
 */

import {
  registerButtonCTA,
  createButtonCTA,
  cleanupButtonCTA,
  getShadowButton,
  waitForShadowDOM
} from './test-utils';
import { ButtonCTA } from '../platforms/web/ButtonCTA.web';

describe('Test Infrastructure Setup', () => {
  describe('Custom Element Registration', () => {
    it('should register ButtonCTA custom element', () => {
      registerButtonCTA();
      
      const isRegistered = customElements.get('button-cta') !== undefined;
      expect(isRegistered).toBe(true);
    });
    
    it('should not throw error when registering multiple times', () => {
      expect(() => {
        registerButtonCTA();
        registerButtonCTA();
      }).not.toThrow();
    });
    
    it('should create ButtonCTA element using document.createElement', () => {
      registerButtonCTA();
      
      const button = document.createElement('button-cta');
      expect(button).toBeInstanceOf(HTMLElement);
      expect(button.tagName.toLowerCase()).toBe('button-cta');
    });
  });
  
  describe('Shadow DOM Rendering', () => {
    let button: ButtonCTA;
    
    afterEach(() => {
      if (button) {
        cleanupButtonCTA(button);
      }
    });
    
    it('should initialize shadow DOM when element is appended to document', async () => {
      registerButtonCTA();
      
      button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test Button';
      document.body.appendChild(button);
      
      await waitForShadowDOM(button);
      
      expect(button.shadowRoot).toBeTruthy();
    });
    
    it('should render button element inside shadow DOM', async () => {
      registerButtonCTA();
      
      button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test Button';
      document.body.appendChild(button);
      
      await waitForShadowDOM(button);
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.tagName.toLowerCase()).toBe('button');
    });
    
    it('should render button label inside shadow DOM', async () => {
      registerButtonCTA();
      
      button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test Label';
      document.body.appendChild(button);
      
      await waitForShadowDOM(button);
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton?.textContent).toContain('Test Label');
    });
  });
  
  describe('Test Utilities', () => {
    let button: ButtonCTA;
    
    afterEach(() => {
      if (button) {
        cleanupButtonCTA(button);
      }
    });
    
    it('should create button with createButtonCTA helper', async () => {
      button = await createButtonCTA({ label: 'Helper Test' });
      
      expect(button).toBeTruthy();
      expect(button.shadowRoot).toBeTruthy();
      expect(button.label).toBe('Helper Test');
    });
    
    it('should create button with all props using helper', async () => {
      button = await createButtonCTA({
        label: 'Complete Button',
        size: 'large',
        buttonVariant: 'secondary',
        icon: 'arrow-right',
        noWrap: true,
        disabled: false,
        testID: 'test-button'
      });
      
      expect(button.label).toBe('Complete Button');
      expect(button.size).toBe('large');
      expect(button.buttonVariant).toBe('secondary');
      expect(button.icon).toBe('arrow-right');
      expect(button.noWrap).toBe(true);
      expect(button.disabled).toBe(false);
      expect(button.testID).toBe('test-button');
    });
    
    it('should get shadow button using helper', async () => {
      button = await createButtonCTA({ label: 'Test' });
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.tagName.toLowerCase()).toBe('button');
    });
    
    it('should clean up button using helper', async () => {
      button = await createButtonCTA({ label: 'Test' });
      
      expect(document.body.contains(button)).toBe(true);
      
      cleanupButtonCTA(button);
      
      expect(document.body.contains(button)).toBe(false);
    });
  });
  
  describe('Jest Configuration', () => {
    it('should have jsdom environment available', () => {
      expect(document).toBeDefined();
      expect(window).toBeDefined();
      expect(customElements).toBeDefined();
    });
    
    it('should support async/await in tests', async () => {
      const promise = Promise.resolve('test');
      const result = await promise;
      expect(result).toBe('test');
    });
    
    it('should support DOM manipulation', () => {
      const div = document.createElement('div');
      div.textContent = 'Test Content';
      document.body.appendChild(div);
      
      expect(document.body.contains(div)).toBe(true);
      expect(div.textContent).toBe('Test Content');
      
      document.body.removeChild(div);
      expect(document.body.contains(div)).toBe(false);
    });
  });
  
  describe('Web Components API', () => {
    it('should support custom elements API', () => {
      expect(customElements).toBeDefined();
      expect(typeof customElements.define).toBe('function');
      expect(typeof customElements.get).toBe('function');
    });
    
    it('should support shadow DOM API', () => {
      const div = document.createElement('div');
      const shadow = div.attachShadow({ mode: 'open' });
      
      expect(shadow).toBeTruthy();
      expect(div.shadowRoot).toBe(shadow);
    });
    
    it('should support shadow DOM content manipulation', () => {
      const div = document.createElement('div');
      const shadow = div.attachShadow({ mode: 'open' });
      
      const span = document.createElement('span');
      span.textContent = 'Shadow Content';
      shadow.appendChild(span);
      
      expect(shadow.querySelector('span')).toBe(span);
      expect(shadow.querySelector('span')?.textContent).toBe('Shadow Content');
    });
  });
});
