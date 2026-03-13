/**
 * @category evergreen
 * @purpose Verify Nav-SegmentedChoice-Base Android implementation: contract compliance via source analysis
 * @jest-environment jsdom
 */
/**
 * Nav-SegmentedChoice-Base Android — Behavioral Contract Tests
 *
 * Since Kotlin code can't execute in Jest, these tests verify contract compliance
 * via static analysis of the Kotlin source file and cross-platform consistency checks.
 *
 * Validates all Android-applicable contracts from contracts.yaml.
 *
 * @module Nav-SegmentedChoice-Base/__tests__
 * @see .kiro/specs/049-nav-segmentedchoice-base/contracts.yaml
 */

import * as fs from 'fs';
import * as path from 'path';

const KT_PATH = path.resolve(__dirname, '../platforms/android/NavSegmentedChoiceBase.android.kt');
const kt = fs.readFileSync(KT_PATH, 'utf-8');

describe('Nav-SegmentedChoice-Base Android — Contract Compliance', () => {

  // ==========================================================================
  // Visual Contracts
  // ==========================================================================

  describe('Visual Contracts (source analysis)', () => {
    it('visual_background: uses container surface and padding tokens', () => {
      expect(kt).toContain('color_structure_surface');
      expect(kt).toContain('space_050');
    });

    it('visual_border: uses border and radius tokens', () => {
      expect(kt).toContain('border_default');
      expect(kt).toContain('radius_normal');
    });

    it('visual_shadow: uses Modifier.shadow() with shadow_navigation_indicator, NOT elevation mapping', () => {
      expect(kt).toContain('.shadow(');
      expect(kt).toContain('shadow_navigation_indicator');
      // Must NOT use elevation mapping or Surface(elevation)
      expect(kt).not.toContain('mapShadowToElevation');
      expect(kt).not.toContain('Surface(elevation');
    });

    it('visual_state_colors: uses canvas for indicator, navigation for segments', () => {
      expect(kt).toContain('color_structure_canvas');
      expect(kt).toContain('color_action_navigation');
    });

    it('visual_size_variants: defines STANDARD and CONDENSED with correct tokens', () => {
      expect(kt).toContain('space_150');
      expect(kt).toContain('space_200');
      expect(kt).toContain('font_size_125');
      expect(kt).toContain('line_height_125');
      expect(kt).toContain('space_100');
      expect(kt).toContain('font_size_100');
      expect(kt).toContain('line_height_100');
    });
  });

  // ==========================================================================
  // Layout Contracts
  // ==========================================================================

  describe('Layout Contracts (source analysis)', () => {
    it('layout_flexible_length: uses weight(1f) for equal-width and tap_area_minimum', () => {
      expect(kt).toContain('.weight(1f)');
      expect(kt).toContain('tap_area_minimum');
    });
  });

  // ==========================================================================
  // Content Contracts
  // ==========================================================================

  describe('Content Contracts (source analysis)', () => {
    it('content_displays_label: renders Text for text segments', () => {
      expect(kt).toContain('is SegmentOption.Text -> Text(');
    });

    it('content_supports_icon: renders Icon for icon segments', () => {
      expect(kt).toContain('is SegmentOption.IconSegment -> Icon(');
    });

    it('content_displays_fallback: falls back to first segment', () => {
      expect(kt).toContain('segments.first().value');
    });
  });

  // ==========================================================================
  // Interaction Contracts
  // ==========================================================================

  describe('Interaction Contracts (source analysis)', () => {
    it('interaction_pressable: clickable with onSelectionChange', () => {
      expect(kt).toContain('.clickable(');
      expect(kt).toContain('onSelectionChange(');
    });

    it('interaction_noop_active: guard against active segment tap', () => {
      expect(kt).toContain('if (segment.value != resolvedSelectedValue)');
    });

    it('interaction_keyboard_navigation: onKeyEvent with arrow keys and wrapping', () => {
      expect(kt).toContain('.onKeyEvent');
      expect(kt).toContain('Key.DirectionLeft');
      expect(kt).toContain('Key.DirectionRight');
      expect(kt).toContain('% segments.size');
    });

    it('interaction_keyboard_activation: Enter and Space key handling', () => {
      expect(kt).toContain('Key.Enter');
      expect(kt).toContain('Key.Spacebar');
    });

    it('interaction_focus: focusRequester and focusable per segment', () => {
      expect(kt).toContain('FocusRequester');
      expect(kt).toContain('.focusRequester(');
      expect(kt).toContain('.focusable()');
    });
  });

  // ==========================================================================
  // Animation Contracts
  // ==========================================================================

  describe('Animation Contracts (source analysis)', () => {
    it('animation_coordination: four-phase with correct easing tokens', () => {
      expect(kt).toContain('EasingAccelerate');
      expect(kt).toContain('EasingStandard');
      expect(kt).toContain('EasingGlideDecelerate');
      expect(kt).toContain('EasingDecelerate');
      expect(kt).toContain('Duration150');
      expect(kt).toContain('Duration350');
    });

    it('animation_coordination: phases in correct order', () => {
      const phase1 = kt.indexOf('Phase 1: Shadow out');
      const phase23 = kt.indexOf('Phase 2+3: Resize + Glide');
      const phase4 = kt.indexOf('Phase 4: Shadow in');
      expect(phase1).toBeGreaterThan(-1);
      expect(phase23).toBeGreaterThan(phase1);
      expect(phase4).toBeGreaterThan(phase23);
    });

    it('animation_coordination: uses Animatable for offset, width, and shadow', () => {
      expect(kt).toContain('Animatable');
      expect(kt).toContain('indicatorOffsetPx');
      expect(kt).toContain('indicatorWidthPx');
      expect(kt).toContain('shadowAlpha');
    });

    it('animation_initial_render: snaps position before hasRendered', () => {
      expect(kt).toContain('LaunchedEffect(Unit)');
      expect(kt).toContain('snapTo(targetOffsetPx)');
      expect(kt).toContain('hasRendered = true');
    });

    it('accessibility_reduced_motion: checks TRANSITION_ANIMATION_SCALE', () => {
      expect(kt).toContain('Settings.Global.TRANSITION_ANIMATION_SCALE');
      expect(kt).toContain('reduceMotion');
    });
  });

  // ==========================================================================
  // Accessibility Contracts
  // ==========================================================================

  describe('Accessibility Contracts (source analysis)', () => {
    it('accessibility_aria_roles: uses Role.Tab and selected state', () => {
      expect(kt).toContain('role = Role.Tab');
      expect(kt).toContain('selected = isSelected');
    });

    it('accessibility_aria_controls: generates panel identifier from componentId', () => {
      expect(kt).toContain('testTag = "${componentId}-panel-${segment.value}"');
    });

    it('accessibility_alt_text: icon segments use accessibilityLabel', () => {
      expect(kt).toContain('is SegmentOption.IconSegment -> segment.accessibilityLabel');
    });
  });

  // ==========================================================================
  // Validation Contracts
  // ==========================================================================

  describe('Validation Contracts (source analysis)', () => {
    it('validation_selection_constraints: require minimum 2 segments', () => {
      expect(kt).toContain('require(segments.size >= 2)');
    });
  });

  // ==========================================================================
  // Cross-Platform Consistency
  // ==========================================================================

  describe('Cross-Platform Consistency', () => {
    it('should define the same segment option types as types.ts', () => {
      expect(kt).toContain('class Text(value: String, val label: String)');
      expect(kt).toContain('class IconSegment(value: String, val icon: String, val accessibilityLabel: String)');
    });

    it('should define the same size variants as types.ts', () => {
      expect(kt).toContain('STANDARD');
      expect(kt).toContain('CONDENSED');
    });

    it('should use the same icon sizes as web and iOS (28 standard, 24 condensed)', () => {
      expect(kt).toContain('STANDARD -> 28');
      expect(kt).toContain('CONDENSED -> 24');
    });
  });
});
