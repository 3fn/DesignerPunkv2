/**
 * @category evergreen
 * @purpose Verify Nav-SegmentedChoice-Base iOS implementation: contract compliance via source analysis
 * @jest-environment jsdom
 */
/**
 * Nav-SegmentedChoice-Base iOS — Behavioral Contract Tests
 *
 * Since Swift code can't execute in Jest, these tests verify contract compliance
 * via static analysis of the Swift source file and cross-platform consistency
 * checks against the shared types.ts.
 *
 * Validates all iOS-applicable contracts from contracts.yaml.
 *
 * @module Nav-SegmentedChoice-Base/__tests__
 * @see .kiro/specs/049-nav-segmentedchoice-base/contracts.yaml
 */

import * as fs from 'fs';
import * as path from 'path';

const SWIFT_PATH = path.resolve(__dirname, '../platforms/ios/NavSegmentedChoiceBase.ios.swift');
const swift = fs.readFileSync(SWIFT_PATH, 'utf-8');

describe('Nav-SegmentedChoice-Base iOS — Contract Compliance', () => {

  // ==========================================================================
  // Visual Contracts
  // ==========================================================================

  describe('Visual Contracts (source analysis)', () => {
    it('visual_background: uses container surface and padding tokens', () => {
      expect(swift).toContain('colorStructureSurface');
      expect(swift).toContain('space050');
    });

    it('visual_border: uses border and radius tokens', () => {
      expect(swift).toContain('borderDefault');
      expect(swift).toContain('radiusNormal');
    });

    it('visual_shadow: uses shadow.navigation.indicator token', () => {
      expect(swift).toContain('shadowNavigationIndicator');
    });

    it('visual_state_colors: uses canvas for indicator, navigation for segments', () => {
      expect(swift).toContain('colorStructureCanvas');
      expect(swift).toContain('colorActionNavigation');
    });

    it('visual_size_variants: defines standard and condensed with correct tokens', () => {
      expect(swift).toContain('space150');
      expect(swift).toContain('space200');
      expect(swift).toContain('fontSize125');
      expect(swift).toContain('lineHeight125');
      expect(swift).toContain('space100');
      expect(swift).toContain('fontSize100');
      expect(swift).toContain('lineHeight100');
    });
  });

  // ==========================================================================
  // Layout Contracts
  // ==========================================================================

  describe('Layout Contracts (source analysis)', () => {
    it('layout_flexible_length: uses GeometryReader for equal-width and tapAreaMinimum', () => {
      expect(swift).toContain('GeometryReader');
      expect(swift).toContain('segmentWidth');
      expect(swift).toContain('tapAreaMinimum');
    });
  });

  // ==========================================================================
  // Content Contracts
  // ==========================================================================

  describe('Content Contracts (source analysis)', () => {
    it('content_displays_label: renders Text for text segments', () => {
      expect(swift).toContain('case .text(_, let label)');
      expect(swift).toContain('Text(label)');
    });

    it('content_supports_icon: renders Image for icon segments', () => {
      expect(swift).toContain('case .icon(_, let icon,');
      expect(swift).toContain('IconBase(');
    });

    it('content_displays_fallback: falls back to first segment', () => {
      expect(swift).toContain('resolvedSelectedValue');
      expect(swift).toContain('segments.first?.value');
    });
  });

  // ==========================================================================
  // Interaction Contracts
  // ==========================================================================

  describe('Interaction Contracts (source analysis)', () => {
    it('interaction_pressable: Button with handleTap action', () => {
      expect(swift).toContain('Button(action:');
      expect(swift).toContain('handleTap');
      expect(swift).toContain('onSelectionChange?(value)');
    });

    it('interaction_noop_active: guard against active segment tap', () => {
      expect(swift).toContain('guard value != resolvedSelectedValue else { return }');
    });

    it('interaction_keyboard_navigation: onMoveCommand with wrapping', () => {
      expect(swift).toContain('.onMoveCommand');
      expect(swift).toContain('segments.count) % segments.count');
    });

    it('interaction_roving_tabindex: @FocusState tracks focused segment', () => {
      expect(swift).toContain('@FocusState');
      expect(swift).toContain('focusedSegment');
      expect(swift).toContain('.focused($focusedSegment');
    });
  });

  // ==========================================================================
  // Animation Contracts
  // ==========================================================================

  describe('Animation Contracts (source analysis)', () => {
    it('animation_coordination: four-phase with correct easing tokens', () => {
      expect(swift).toContain('easingAccelerate');
      expect(swift).toContain('easingStandard');
      expect(swift).toContain('easingGlideDecelerate');
      expect(swift).toContain('easingDecelerate');
      expect(swift).toContain('duration150');
      expect(swift).toContain('duration350');
    });

    it('animation_coordination: phases in correct order', () => {
      const shadowOutIdx = swift.indexOf('Phase 1: Shadow out');
      const glideIdx = swift.indexOf('Phase 2+3: Resize + Glide');
      const shadowInIdx = swift.indexOf('Phase 4: Shadow in');
      expect(shadowOutIdx).toBeGreaterThan(-1);
      expect(glideIdx).toBeGreaterThan(shadowOutIdx);
      expect(shadowInIdx).toBeGreaterThan(glideIdx);
    });

    it('animation_initial_render: positions without animation on appear', () => {
      expect(swift).toContain('.onAppear');
      expect(swift).toContain('hasRendered = true');
    });

    it('accessibility_reduced_motion: checks UIAccessibility.isReduceMotionEnabled', () => {
      expect(swift).toContain('UIAccessibility.isReduceMotionEnabled');
    });
  });

  // ==========================================================================
  // Accessibility Contracts
  // ==========================================================================

  describe('Accessibility Contracts (source analysis)', () => {
    it('accessibility_aria_roles: uses isButton and isSelected traits', () => {
      expect(swift).toContain('.accessibilityAddTraits(.isButton)');
      expect(swift).toContain('.accessibilityAddTraits(isSelected ? .isSelected : [])');
    });

    it('accessibility_aria_controls: generates panel identifier from componentId', () => {
      expect(swift).toContain('panelIdentifier');
      expect(swift).toContain('\\(id)-panel-\\(segment.value)');
    });

    it('accessibility_alt_text: icon segments use accessibilityLabel', () => {
      expect(swift).toContain('.accessibilityLabel(segmentAccessibilityLabel');
      expect(swift).toContain('case .icon(_, _, let accessibilityLabel): return accessibilityLabel');
    });
  });

  // ==========================================================================
  // Validation Contracts
  // ==========================================================================

  describe('Validation Contracts (source analysis)', () => {
    it('validation_selection_constraints: precondition for minimum 2 segments', () => {
      expect(swift).toContain('precondition(segments.count >= 2');
    });
  });

  // ==========================================================================
  // Cross-Platform Consistency
  // ==========================================================================

  describe('Cross-Platform Consistency', () => {
    it('should define the same segment option types as types.ts', () => {
      // iOS has .text and .icon cases matching TS TextSegmentOption / IconSegmentOption
      expect(swift).toContain('case text(value: String, label: String)');
      expect(swift).toContain('case icon(value: String, icon: String, accessibilityLabel: String)');
    });

    it('should define the same size variants as types.ts', () => {
      expect(swift).toContain('case standard');
      expect(swift).toContain('case condensed');
    });

    it('should use the same icon sizes as web (28 standard, 24 condensed)', () => {
      expect(swift).toContain('case .standard: return 28');
      expect(swift).toContain('case .condensed: return 24');
    });
  });
});
