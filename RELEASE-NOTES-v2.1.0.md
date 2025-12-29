# Release Notes - v2.1.0

**Release Date**: December 29, 2025
**Previous Version**: 2.0.0
**Spec**: 031 - Blend Infrastructure Implementation

---

## Overview

This release implements the Blend Infrastructure, addressing the gap identified in Spec 024 where blend tokens were defined as calculation parameters but no mechanism existed to execute the calculation and deliver consumable color values to components.

---

## ✨ New Features

### Blend Utility Infrastructure
- **BlendUtilityGenerator** integrated into TokenFileGenerator build pipeline
- Platform-native runtime utilities generated for Web (TypeScript), iOS (Swift), and Android (Kotlin)
- Four blend operations: `darkerBlend()`, `lighterBlend()`, `saturate()`, `desaturate()`
- Theme-aware wrapper functions for automatic theme context awareness

### Theme-Aware Blend Utilities
- **Web**: `getBlendUtilities()` factory function for vanilla Web Components
- **iOS**: Color extensions with SwiftUI environment integration
- **Android**: Color extensions with Compose MaterialTheme integration

---

## 🐛 Bug Fixes

### Component Workaround Removals
- **ButtonCTA**: Removed `opacity: 0.92` hover, `opacity: 0.84` pressed, `opacity: 0.6` disabled workarounds
- **ButtonCTA iOS**: Removed `scaleEffect(0.96)` pressed workaround
- **ButtonCTA Android**: Removed Material ripple pressed workaround
- **Icon**: Removed CSS `filter: brightness(1.08)` optical balance workaround

---

## 🔧 Improvements

### Component Updates
- **ButtonCTA**: Now uses semantic blend utilities for hover/pressed/disabled/icon states
- **TextInputField**: Now uses semantic blend utilities for focus/disabled states
- **Container**: Now uses semantic blend utilities for hover state
- **Icon**: Now uses semantic blend utilities for optical balance

---

## 📊 Validation

### Test Coverage
- **Total Tests**: 6,045 passing
- **Blend-Specific Tests**: 150 passing
- **Test Suites**: 262 passing

### Layer 1 Validation (Numerical Precision)
- ✅ BlendCalculator.test.ts - All blend operations produce correct results
- ✅ BlendCrossPlatformConsistency.test.ts - Cross-platform results within ±1 RGB tolerance

### Layer 2 Validation (Token-Naming)
- ✅ BlendTokenUsageValidation.test.ts - All components use correct blend utility + token combinations
- ✅ No workarounds detected (opacity, filter, scaleEffect, Material ripple)

---

## 📁 Primary Artifacts

### Generated Blend Utilities
- `dist/BlendUtilities.web.ts` (5,560 bytes)
- `dist/BlendUtilities.ios.swift` (6,612 bytes)
- `dist/BlendUtilities.android.kt` (5,179 bytes)

### Updated Components
- `src/components/core/ButtonCTA/` (Web, iOS, Android)
- `src/components/core/TextInputField/` (Web, iOS, Android)
- `src/components/core/Container/` (Web, iOS, Android)
- `src/components/core/Icon/` (Web, iOS, Android)

### Documentation
- `docs/tokens/blend-tokens.md` - Complete blend token reference
- `docs/token-system-overview.md` - Updated with blend token references
- `.kiro/steering/Component Development and Practices Guide.md` - Blend utility integration patterns

---

## 📋 Spec Completion

**Spec 031 - Blend Infrastructure Implementation**: ✅ COMPLETE

All phases completed successfully:
- ✅ Phase 1: Build Pipeline Integration
- ✅ Phase 2: Component Updates
- ✅ Phase 3: Theme Support

---

## 🔗 Related Documentation

- [Blend Tokens Guide](docs/tokens/blend-tokens.md)
- [Token System Overview](docs/token-system-overview.md)
- [Spec 031 Design](/.kiro/specs/031-blend-infrastructure-implementation/design.md)

---

*Release prepared by Kiro AI Assistant*
