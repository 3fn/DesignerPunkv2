/**
 * @category evergreen
 * @purpose Verify SemanticVersionValidator delegates correctly to VersionCalculator
 */

import { SemanticVersionValidator } from '../validators/SemanticVersionValidator';

describe('SemanticVersionValidator', () => {
  let validator: SemanticVersionValidator;

  beforeEach(() => { validator = new SemanticVersionValidator(); });

  describe('validateFormat', () => {
    it('should accept valid semver', () => {
      expect(validator.validateFormat('1.2.3').valid).toBe(true);
      expect(validator.validateFormat('0.0.1').valid).toBe(true);
      expect(validator.validateFormat('1.2.3-alpha.1').valid).toBe(true);
      expect(validator.validateFormat('1.2.3+build.123').valid).toBe(true);
    });

    it('should reject invalid semver', () => {
      expect(validator.validateFormat('invalid').valid).toBe(false);
      expect(validator.validateFormat('1.2').valid).toBe(false);
      expect(validator.validateFormat('').valid).toBe(false);
    });
  });

  describe('validateProgression', () => {
    it('should accept valid major bump', () => {
      expect(validator.validateProgression('1.2.3', '2.0.0', 'major').valid).toBe(true);
    });

    it('should accept valid minor bump', () => {
      expect(validator.validateProgression('1.2.3', '1.3.0', 'minor').valid).toBe(true);
    });

    it('should accept valid patch bump', () => {
      expect(validator.validateProgression('1.2.3', '1.2.4', 'patch').valid).toBe(true);
    });

    it('should reject invalid progression', () => {
      expect(validator.validateProgression('1.2.3', '1.2.5', 'patch').valid).toBe(false);
    });

    it('should reject invalid version format', () => {
      expect(validator.validateProgression('invalid', '1.0.0', 'major').valid).toBe(false);
    });
  });
});
