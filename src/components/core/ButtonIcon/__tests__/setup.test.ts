/**
 * @category evergreen
 * @purpose Verify test infrastructure setup for Button-Icon component
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
 * Stemma System Naming: [Family]-[Type] = Button-Icon
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-Icon/__tests__/setup
 * @see Requirements: Testing infrastructure
 */

import {
  registerButtonIcon,
  createButtonIcon,
  cleanupButtonIcon,
  getShadowButton,
  getIconContainer,
  getIconElement,
  waitForShadowDOM,
  hasClass,
  clickButton,
  pressKey
} from './test-utils';
import { ButtonIcon } from '../platforms/web/ButtonIcon.web';

describe('Button-Icon Test Infrastructure Setup', () => {
  describe('Custom Element Registration', () => {
    it('should register Button-Icon custom element', () => {
      registerButtonIcon();
      
      const isRegistered = customElements.get('button-icon') !== undefined;
      expect(isRegistered).toBe(true);
    });
    
    it('should not throw error when registering multiple times', () => {
      expect(() => {
        registerButtonIcon();
        registerButtonIcon();
      }).not.toThrow();
    });
    
    it('should create Button-Icon element using document.createElement', () => {
      registerButtonIcon();
      
      const button = document.createElement('button-icon');
      expect(button).toBeInstanceOf(HTMLElement);
      expect(button.tagName.toLowerCase()).toBe('button-icon');
    });
  });
  
  describe('Shadow DOM Rendering', () => {
    let button: ButtonIcon;
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
    });
    
    it('should initialize shadow DOM when element is appended to document', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = 'Test Button';
      document.body.appendChild(button);
      
      await waitForShadowDOM(button);
      
      expect(button.shadowRoot).toBeTruthy();
    });
    
    it('should render button element inside shadow DOM', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = 'Test Button';
      document.body.appendChild(button);
      
      await waitForShadowDOM(button);
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.tagName.toLowerCase()).toBe('button');
    });
    
    it('should render icon-base element inside shadow DOM', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = 'Settings';
      document.body.appendChild(button);
      
      await waitForShadowDOM(button);
      
      const iconElement = getIconElement(button);
      expect(iconElement).toBeTruthy();
      expect(iconElement?.tagName.toLowerCase()).toBe('icon-base');
    });
    
    it('should apply aria-label to shadow button', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = 'Open Settings';
      document.body.appendChild(button);
      
      await waitForShadowDOM(button);
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton?.getAttribute('aria-label')).toBe('Open Settings');
    });
  });
  
  describe('Test Utilities', () => {
    let button: ButtonIcon;
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
    });
    
    it('should create button with createButtonIcon helper', async () => {
      button = await createButtonIcon({ 
        icon: 'settings', 
        ariaLabel: 'Helper Test' 
      });
      
      expect(button).toBeTruthy();
      expect(button.shadowRoot).toBeTruthy();
      expect(button.icon).toBe('settings');
      expect(button.ariaLabel).toBe('Helper Test');
    });
    
    it('should create button with all props using helper', async () => {
      button = await createButtonIcon({
        icon: 'arrow-right',
        ariaLabel: 'Complete Button',
        size: 'large',
        variant: 'secondary',
        testID: 'test-button'
      });
      
      expect(button.icon).toBe('arrow-right');
      expect(button.ariaLabel).toBe('Complete Button');
      expect(button.size).toBe('large');
      expect(button.buttonVariant).toBe('secondary');
      expect(button.testID).toBe('test-button');
    });
    
    it('should get shadow button using helper', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.tagName.toLowerCase()).toBe('button');
    });
    
    it('should get icon container using helper', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      const iconContainer = getIconContainer(button);
      expect(iconContainer).toBeTruthy();
      expect(iconContainer?.classList.contains('button-icon__icon')).toBe(true);
    });
    
    it('should get icon element using helper', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      const iconElement = getIconElement(button);
      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('name')).toBe('check');
    });
    
    it('should clean up button using helper', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      expect(document.body.contains(button)).toBe(true);
      
      cleanupButtonIcon(button);
      
      expect(document.body.contains(button)).toBe(false);
    });
    
    it('should check CSS class using hasClass helper', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test',
        size: 'large',
        variant: 'primary'
      });
      
      expect(hasClass(button, 'button-icon')).toBe(true);
      expect(hasClass(button, 'button-icon--large')).toBe(true);
      expect(hasClass(button, 'button-icon--primary')).toBe(true);
      expect(hasClass(button, 'button-icon--small')).toBe(false);
    });
  });
  
  describe('Event Handling', () => {
    let button: ButtonIcon;
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
    });
    
    it('should dispatch press event on click', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      const pressHandler = jest.fn();
      button.addEventListener('press', pressHandler);
      
      clickButton(button);
      
      expect(pressHandler).toHaveBeenCalledTimes(1);
    });
    
    it('should dispatch press event on Enter key', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      const pressHandler = jest.fn();
      button.addEventListener('press', pressHandler);
      
      pressKey(button, 'Enter');
      
      expect(pressHandler).toHaveBeenCalledTimes(1);
    });
    
    it('should dispatch press event on Space key', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      const pressHandler = jest.fn();
      button.addEventListener('press', pressHandler);
      
      pressKey(button, ' ');
      
      expect(pressHandler).toHaveBeenCalledTimes(1);
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
  
  describe('Default Values', () => {
    let button: ButtonIcon;
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
    });
    
    it('should default to medium size', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      expect(button.size).toBe('medium');
      expect(hasClass(button, 'button-icon--medium')).toBe(true);
    });
    
    it('should default to primary variant', async () => {
      button = await createButtonIcon({ 
        icon: 'check', 
        ariaLabel: 'Test' 
      });
      
      expect(button.buttonVariant).toBe('primary');
      expect(hasClass(button, 'button-icon--primary')).toBe(true);
    });
  });
});
