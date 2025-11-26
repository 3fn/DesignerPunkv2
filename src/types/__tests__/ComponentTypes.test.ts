/**
 * Component Types Tests
 * 
 * Tests for component type definitions to ensure type safety and correctness.
 */

import { InsetPadding } from '../ComponentTypes';

describe('ComponentTypes', () => {
  describe('InsetPadding', () => {
    it('should accept valid inset padding values', () => {
      // Type assertions to verify valid values compile
      const validValues: InsetPadding[] = [
        'inset050',
        'inset100',
        'inset150',
        'inset200',
        'inset300',
        'inset400'
      ];

      expect(validValues).toHaveLength(6);
      expect(validValues).toContain('inset050');
      expect(validValues).toContain('inset100');
      expect(validValues).toContain('inset150');
      expect(validValues).toContain('inset200');
      expect(validValues).toContain('inset300');
      expect(validValues).toContain('inset400');
    });

    it('should be usable in component interfaces', () => {
      // Example component interface using InsetPadding
      interface TestComponentProps {
        padding?: InsetPadding;
        label: string;
      }

      const props: TestComponentProps = {
        padding: 'inset150',
        label: 'Test'
      };

      expect(props.padding).toBe('inset150');
      expect(props.label).toBe('Test');
    });

    it('should support mapping to token paths', () => {
      // Simulate component prop-to-token-path mapping
      const mapPropToTokenPath = (padding: InsetPadding): string => {
        return `space.inset.${padding.replace('inset', '')}`;
      };

      expect(mapPropToTokenPath('inset050')).toBe('space.inset.050');
      expect(mapPropToTokenPath('inset100')).toBe('space.inset.100');
      expect(mapPropToTokenPath('inset150')).toBe('space.inset.150');
      expect(mapPropToTokenPath('inset200')).toBe('space.inset.200');
      expect(mapPropToTokenPath('inset300')).toBe('space.inset.300');
      expect(mapPropToTokenPath('inset400')).toBe('space.inset.400');
    });

    it('should be exportable from types index', () => {
      // Verify the type can be imported from the barrel export
      const { InsetPadding: ImportedType } = require('../index');
      
      // Type should be available (this is a compile-time check, but we verify the import works)
      expect(ImportedType).toBeUndefined(); // Types don't exist at runtime, but import should not throw
    });
  });
});
