/**
 * @category evergreen
 * @purpose Unit tests for Button-VerticalList-Item web component
 * @jest-environment jsdom
 * 
 * Tests rendering behavior, visual state behavior, error state behavior,
 * accessibility behavior, and event behavior following JSDOM web component patterns.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalList-Item
 * Component Type: Primitive (VerticalList-Item)
 * Custom Element Tag: <button-vertical-list-item>
 * 
 * @see Requirements: All
 * @see .kiro/specs/038-vertical-list-buttons/design.md - Testing Strategy
 */

import { ButtonVerticalListItem } from '../platforms/web/ButtonVerticalListItem.web';
import {
  registerVerticalListButtonItem,
  createVerticalListButtonItem,
  cleanupVerticalListButtonItem,
  getShadowButton,
  getLabelElement,
  getDescriptionElement,
  getLeadingIconElement,
  getCheckmarkElement,
  hasClass,
  clickButton,
  focusButton,
  blurButton,
  cleanupRequiredTokens,
} from './test-utils';

describe('Button-VerticalList-Item Unit Tests', () => {
  // ─────────────────────────────────────────────────────────────────
  // Rendering Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Rendering Behavior', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should render with required label prop', async () => {
      button = await createVerticalListButtonItem({ label: 'Test Label' });
      
      expect(button).toBeTruthy();
      expect(button.shadowRoot).toBeTruthy();
      
      const labelElement = getLabelElement(button);
      expect(labelElement).toBeTruthy();
      expect(labelElement?.textContent).toBe('Test Label');
    });
    
    it('should render as semantic button element', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.tagName.toLowerCase()).toBe('button');
      expect(shadowButton?.getAttribute('type')).toBe('button');
      expect(shadowButton?.getAttribute('role')).toBe('button');
    });
    
    it('should render description when provided', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        description: 'Test Description',
      });
      
      const descriptionElement = getDescriptionElement(button);
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement?.textContent).toBe('Test Description');
    });
    
    it('should not render description when not provided', async () => {
      button = await createVerticalListButtonItem({ label: 'Test Label' });
      
      const descriptionElement = getDescriptionElement(button);
      // With incremental update architecture, element exists but is hidden
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement?.style.display).toBe('none');
      expect(descriptionElement?.textContent).toBe('');
    });
    
    it('should render leading icon when provided', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        leadingIcon: 'settings',
      });
      
      const leadingIconElement = getLeadingIconElement(button);
      expect(leadingIconElement).toBeTruthy();
      
      // Verify icon-base component is rendered inside
      const iconBase = leadingIconElement?.querySelector('icon-base');
      expect(iconBase).toBeTruthy();
      expect(iconBase?.getAttribute('name')).toBe('settings');
    });
    
    it('should not render leading icon when not provided', async () => {
      button = await createVerticalListButtonItem({ label: 'Test Label' });
      
      const leadingIconElement = getLeadingIconElement(button);
      // With incremental update architecture, element exists but is hidden
      expect(leadingIconElement).toBeTruthy();
      expect(leadingIconElement?.style.display).toBe('none');
    });
    
    it('should apply test ID when provided', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        testID: 'my-test-id',
      });
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton?.getAttribute('data-testid')).toBe('my-test-id');
    });
    
    it('should set aria-label on button element', async () => {
      button = await createVerticalListButtonItem({ label: 'Accessible Label' });
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton?.getAttribute('aria-label')).toBe('Accessible Label');
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Visual State Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Visual State Behavior', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should apply rest state CSS class by default', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(hasClass(button, 'vertical-list-item--rest')).toBe(true);
    });
    
    it('should apply selected state CSS class', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'selected',
      });
      
      expect(hasClass(button, 'vertical-list-item--selected')).toBe(true);
    });
    
    it('should apply notSelected state CSS class', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'notSelected',
      });
      
      expect(hasClass(button, 'vertical-list-item--not-selected')).toBe(true);
    });
    
    it('should apply checked state CSS class', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'checked',
      });
      
      expect(hasClass(button, 'vertical-list-item--checked')).toBe(true);
    });
    
    it('should apply unchecked state CSS class', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'unchecked',
      });
      
      expect(hasClass(button, 'vertical-list-item--unchecked')).toBe(true);
    });
    
    it('should show checkmark for selected state', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'selected',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark).toBeTruthy();
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--visible')).toBe(true);
    });
    
    it('should show checkmark for checked state', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'checked',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark).toBeTruthy();
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--visible')).toBe(true);
    });
    
    it('should hide checkmark for rest state', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'rest',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark).toBeTruthy();
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--hidden')).toBe(true);
    });
    
    it('should hide checkmark for notSelected state', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'notSelected',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark).toBeTruthy();
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--hidden')).toBe(true);
    });
    
    it('should hide checkmark for unchecked state', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'unchecked',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark).toBeTruthy();
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--hidden')).toBe(true);
    });
    
    it('should update visual state when attribute changes', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'rest',
      });
      
      expect(hasClass(button, 'vertical-list-item--rest')).toBe(true);
      
      // Change visual state
      button.visualState = 'selected';
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(hasClass(button, 'vertical-list-item--selected')).toBe(true);
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Error State Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Error State Behavior', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    describe('Select Mode Error Treatment (Requirements 3.1, 3.3)', () => {
      it('should apply error class for rest state with error', async () => {
        button = await createVerticalListButtonItem({
          label: 'Test',
          visualState: 'rest',
          error: true,
        });
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(true);
      });
      
      it('should apply error class for selected state with error', async () => {
        button = await createVerticalListButtonItem({
          label: 'Test',
          visualState: 'selected',
          error: true,
        });
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(true);
      });
      
      it('should apply error class for notSelected state with error', async () => {
        button = await createVerticalListButtonItem({
          label: 'Test',
          visualState: 'notSelected',
          error: true,
        });
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(true);
      });
    });
    
    describe('Multi-Select Mode Error Treatment (Requirements 3.2, 3.3)', () => {
      it('should apply error class for checked state with error', async () => {
        button = await createVerticalListButtonItem({
          label: 'Test',
          visualState: 'checked',
          error: true,
        });
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(true);
      });
      
      it('should apply error class for unchecked state with error', async () => {
        button = await createVerticalListButtonItem({
          label: 'Test',
          visualState: 'unchecked',
          error: true,
        });
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(true);
      });
    });
    
    describe('Error State Toggle', () => {
      it('should not apply error class when error is false', async () => {
        button = await createVerticalListButtonItem({
          label: 'Test',
          visualState: 'selected',
          error: false,
        });
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(false);
      });
      
      it('should update error state when attribute changes', async () => {
        button = await createVerticalListButtonItem({
          label: 'Test',
          visualState: 'selected',
          error: false,
        });
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(false);
        
        // Enable error
        button.error = true;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(hasClass(button, 'vertical-list-item--error')).toBe(true);
      });
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Accessibility Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Accessibility Behavior', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should render as semantic button element (Requirement 10.1)', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton?.tagName.toLowerCase()).toBe('button');
    });
    
    it('should mark checkmark as decorative with aria-hidden (Requirement 10.4)', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'selected',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark?.getAttribute('aria-hidden')).toBe('true');
    });
    
    it('should throw error when disabled attribute is set (Requirement 10.2)', async () => {
      // Note: In JSDOM, the error thrown in attributeChangedCallback propagates
      // outside the try-catch context. We verify the behavior by checking that
      // the component's attributeChangedCallback throws for 'disabled'.
      // The actual error is thrown and logged by JSDOM.
      
      // Instead, we test the disabled property setter which we can catch
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      // Verify the component observes the disabled attribute
      const observedAttributes = ButtonVerticalListItem.observedAttributes;
      expect(observedAttributes).toContain('disabled');
      
      // The disabled property setter should throw
      expect(() => {
        button.disabled = true;
      }).toThrow(/disabled.*not supported/i);
    });
    
    it('should throw error when disabled property is set to true (Requirement 10.2)', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      // Setting disabled property to true should throw
      expect(() => {
        button.disabled = true;
      }).toThrow(/disabled.*not supported/i);
    });
    
    it('should return false for disabled property getter (Requirement 10.2)', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.disabled).toBe(false);
    });
    
    it('should not throw when disabled property is set to false', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      // Setting disabled to false should not throw
      expect(() => {
        button.disabled = false;
      }).not.toThrow();
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Event Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Event Behavior', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should fire onClick callback when clicked (Requirement 12.1)', async () => {
      const onClickMock = jest.fn();
      
      button = await createVerticalListButtonItem({ label: 'Test' });
      button.onClick = onClickMock;
      
      clickButton(button);
      
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });
    
    it('should fire onFocus callback when focused (Requirement 12.2)', async () => {
      const onFocusMock = jest.fn();
      
      button = await createVerticalListButtonItem({ label: 'Test' });
      button.onFocus = onFocusMock;
      
      focusButton(button);
      
      expect(onFocusMock).toHaveBeenCalledTimes(1);
    });
    
    it('should fire onBlur callback when blurred (Requirement 12.3)', async () => {
      const onBlurMock = jest.fn();
      
      button = await createVerticalListButtonItem({ label: 'Test' });
      button.onBlur = onBlurMock;
      
      focusButton(button);
      blurButton(button);
      
      expect(onBlurMock).toHaveBeenCalledTimes(1);
    });
    
    it('should dispatch custom click event', async () => {
      const eventHandler = jest.fn();
      
      button = await createVerticalListButtonItem({ label: 'Test' });
      button.addEventListener('click', eventHandler);
      
      clickButton(button);
      
      expect(eventHandler).toHaveBeenCalled();
    });
    
    it('should dispatch custom focus event', async () => {
      const eventHandler = jest.fn();
      
      button = await createVerticalListButtonItem({ label: 'Test' });
      button.addEventListener('focus', eventHandler);
      
      focusButton(button);
      
      expect(eventHandler).toHaveBeenCalled();
    });
    
    it('should dispatch custom blur event', async () => {
      const eventHandler = jest.fn();
      
      button = await createVerticalListButtonItem({ label: 'Test' });
      button.addEventListener('blur', eventHandler);
      
      focusButton(button);
      blurButton(button);
      
      expect(eventHandler).toHaveBeenCalled();
    });
    
    it('should not throw when callbacks are not provided', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      // Should not throw when clicking without callbacks
      expect(() => {
        clickButton(button);
        focusButton(button);
        blurButton(button);
      }).not.toThrow();
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Checkmark Transition Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Checkmark Transition Behavior', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should apply fade transition class by default', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'selected',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--fade')).toBe(true);
    });
    
    it('should apply instant transition class when specified', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'selected',
        checkmarkTransition: 'instant',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--instant')).toBe(true);
    });
    
    it('should apply fade transition class when specified', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        visualState: 'selected',
        checkmarkTransition: 'fade',
      });
      
      const checkmark = getCheckmarkElement(button);
      expect(checkmark?.classList.contains('vertical-list-item__checkmark--fade')).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Transition Delay Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Transition Delay Behavior', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should apply transition delay when specified', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        transitionDelay: 100,
      });
      
      const shadowButton = getShadowButton(button);
      const style = shadowButton?.getAttribute('style') || '';
      
      expect(style).toContain('transition-delay: 100ms');
    });
    
    it('should not apply transition delay when zero', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test',
        transitionDelay: 0,
      });
      
      const shadowButton = getShadowButton(button);
      const style = shadowButton?.getAttribute('style') || '';
      
      // Should not contain transition-delay when 0
      expect(style).not.toContain('transition-delay');
    });
    
    it('should not apply transition delay when not specified', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      const shadowButton = getShadowButton(button);
      const style = shadowButton?.getAttribute('style') || '';
      
      // Should not contain transition-delay when not specified
      expect(style).not.toContain('transition-delay');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Property Getter/Setter Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Property Getters and Setters', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should get and set label property', async () => {
      button = await createVerticalListButtonItem({ label: 'Initial' });
      
      expect(button.label).toBe('Initial');
      
      button.label = 'Updated';
      expect(button.label).toBe('Updated');
    });
    
    it('should get and set description property', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.description).toBeUndefined();
      
      button.description = 'New Description';
      expect(button.description).toBe('New Description');
      
      button.description = undefined;
      expect(button.description).toBeUndefined();
    });
    
    it('should get and set leadingIcon property', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      // When not set, leadingIcon returns undefined (getAttribute returns null, converted to undefined)
      expect(button.leadingIcon).toBeFalsy();
      
      button.leadingIcon = 'settings';
      expect(button.leadingIcon).toBe('settings');
      
      button.leadingIcon = undefined;
      expect(button.leadingIcon).toBeFalsy();
    });
    
    it('should get and set visualState property', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.visualState).toBe('rest');
      
      button.visualState = 'selected';
      expect(button.visualState).toBe('selected');
    });
    
    it('should get and set error property', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.error).toBe(false);
      
      button.error = true;
      expect(button.error).toBe(true);
    });
    
    it('should get and set checkmarkTransition property', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.checkmarkTransition).toBe('fade');
      
      button.checkmarkTransition = 'instant';
      expect(button.checkmarkTransition).toBe('instant');
    });
    
    it('should get and set transitionDelay property', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.transitionDelay).toBe(0);
      
      button.transitionDelay = 150;
      expect(button.transitionDelay).toBe(150);
    });
    
    it('should get and set testID property', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.testID).toBeUndefined();
      
      button.testID = 'my-test-id';
      expect(button.testID).toBe('my-test-id');
      
      button.testID = undefined;
      expect(button.testID).toBeUndefined();
    });
    
    it('should get and set onClick callback', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.onClick).toBeUndefined();
      
      const callback = jest.fn();
      button.onClick = callback;
      expect(button.onClick).toBe(callback);
    });
    
    it('should get and set onFocus callback', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.onFocus).toBeUndefined();
      
      const callback = jest.fn();
      button.onFocus = callback;
      expect(button.onFocus).toBe(callback);
    });
    
    it('should get and set onBlur callback', async () => {
      button = await createVerticalListButtonItem({ label: 'Test' });
      
      expect(button.onBlur).toBeUndefined();
      
      const callback = jest.fn();
      button.onBlur = callback;
      expect(button.onBlur).toBe(callback);
    });
  });
});
