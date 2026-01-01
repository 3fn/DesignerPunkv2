/**
 * Test Setup for Input-Text-Base Component
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * This file previously contained motion token injection utilities that were
 * required as workarounds for JSDOM's CSS custom property limitations.
 * 
 * As of the animation refactor (Spec 027), these utilities are no longer needed:
 * - The component now uses CSS transition-delay instead of JavaScript setTimeout
 * - Icon visibility is determined by state only, not animation state
 * - Tests no longer require motion token injection to pass
 */

// This file is intentionally minimal after the animation refactor.
// Motion token injection is no longer required for Input-Text-Base tests.
