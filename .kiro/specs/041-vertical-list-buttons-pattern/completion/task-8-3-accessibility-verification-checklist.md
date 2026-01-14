# Manual Accessibility Verification Checklist

**Date**: January 13, 2026
**Task**: 8.3 Manual accessibility verification
**Spec**: 041 - Vertical List Buttons Pattern
**Organization**: spec-completion
**Scope**: 041-vertical-list-buttons-pattern
**Status**: Ready for Manual Testing

---

## Overview

This checklist guides manual accessibility verification for the Button-VerticalList-Set and Button-VerticalList-Item components. These tests require human interaction with assistive technologies and cannot be automated.

**Requirements Validated**: 8.1-8.6, 7.6

---

## Test Environment Setup

### Prerequisites

Terminal command: npx serve dist/browser

- [ ] Demo page loaded in browser: `dist/browser/button-vertical-list-set-demo.html`
- [ ] Screen reader enabled (VoiceOver on macOS, NVDA on Windows)
- [ ] Browser developer tools open for ARIA inspection

**To open the demo page:**
1. Build the project: `npm run build`
2. Open `dist/browser/button-vertical-list-set-demo.html` in your browser
3. Or serve locally: `npx serve dist/browser` and navigate to the demo page

### Test Components
The demo page includes all three modes:
1. **Tap Mode** - Action buttons (Settings, Help, About)
2. **Select Mode** - Single selection (Option A, B, C)
3. **MultiSelect Mode** - Multiple selection (Choice 1, 2, 3)
4. **Error State Examples** - Validation error display

---

## Keyboard Navigation Tests

### Requirement 8.1: Tab Navigation
| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Press Tab to enter button group | Focus moves to first item (or last focused item) | [ ] |
| Press Tab to exit button group | Focus moves to next focusable element outside group | [ ] |
| Tab into group, navigate, Tab out, Tab back in | Focus returns to last focused item within group | [ ] |

### Requirement 8.2: Arrow Key Navigation
| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Press Arrow Down on first item | Focus moves to second item | [ ] |
| Press Arrow Down on last item | Focus wraps to first item | [ ] |
| Press Arrow Up on first item | Focus wraps to last item | [ ] |
| Press Arrow Up on second item | Focus moves to first item | [ ] |

### Requirement 8.3: Enter/Space Activation
| Test | Expected | Pass/Fail |
|------|----------|-----------|
| **Tap Mode**: Press Enter on focused item | onItemClick callback invoked | [ ] |
| **Tap Mode**: Press Space on focused item | onItemClick callback invoked | [ ] |
| **Select Mode**: Press Enter on unselected item | Item becomes selected | [ ] |
| **Select Mode**: Press Space on selected item | Item becomes deselected | [ ] |
| **MultiSelect Mode**: Press Enter on unchecked item | Item becomes checked | [ ] |
| **MultiSelect Mode**: Press Space on checked item | Item becomes unchecked | [ ] |

### Requirement 8.4: Home Key
| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Press Home from any item | Focus moves to first item | [ ] |
| Press Home when already on first item | Focus stays on first item | [ ] |

### Requirement 8.5: End Key
| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Press End from any item | Focus moves to last item | [ ] |
| Press End when already on last item | Focus stays on last item | [ ] |

### Requirement 8.6: Roving Tabindex
| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Inspect focused item | Has `tabindex="0"` | [ ] |
| Inspect non-focused items | Have `tabindex="-1"` | [ ] |
| Navigate with arrows, inspect tabindex | Only focused item has `tabindex="0"` | [ ] |

---

## Screen Reader Tests (VoiceOver/NVDA)

### Container Role Announcements

#### Tap Mode
| Test | Expected Announcement | Pass/Fail |
|------|----------------------|-----------|
| Navigate to Tap mode group | "group" role announced | [ ] |
| Focus on item | "button" role announced | [ ] |

#### Select Mode
| Test | Expected Announcement | Pass/Fail |
|------|----------------------|-----------|
| Navigate to Select mode group | "radiogroup" role announced | [ ] |
| Focus on unselected item | "radio, not checked" announced | [ ] |
| Focus on selected item | "radio, checked" announced | [ ] |
| Select an item | State change announced | [ ] |

#### MultiSelect Mode
| Test | Expected Announcement | Pass/Fail |
|------|----------------------|-----------|
| Navigate to MultiSelect mode group | "group" with multiselectable announced | [ ] |
| Focus on unchecked item | "checkbox, not checked" announced | [ ] |
| Focus on checked item | "checkbox, checked" announced | [ ] |
| Toggle an item | State change announced | [ ] |

### Requirement 7.6: Error State Accessibility
| Test | Expected Announcement | Pass/Fail |
|------|----------------------|-----------|
| Error message appears | Alert announced immediately (role="alert") | [ ] |
| Navigate to group with error | "invalid" state announced | [ ] |
| Error message content | Error text read when navigating to group | [ ] |
| Clear error by making valid selection | Error no longer announced | [ ] |

---

## ARIA Attribute Verification

### Inspect with Browser DevTools

#### Container Attributes
| Mode | Expected Attributes | Verified |
|------|---------------------|----------|
| Tap | `role="group"` | [ ] |
| Select | `role="radiogroup"` | [ ] |
| MultiSelect | `role="group"`, `aria-multiselectable="true"` | [ ] |
| Error State | `aria-invalid="true"`, `aria-describedby="[error-id]"` | [ ] |

#### Item Attributes
| Mode | Expected Attributes | Verified |
|------|---------------------|----------|
| Tap | `role="button"` | [ ] |
| Select (unselected) | `role="radio"`, `aria-checked="false"` | [ ] |
| Select (selected) | `role="radio"`, `aria-checked="true"` | [ ] |
| MultiSelect (unchecked) | `role="checkbox"`, `aria-checked="false"` | [ ] |
| MultiSelect (checked) | `role="checkbox"`, `aria-checked="true"` | [ ] |

#### Error Message Element
| Attribute | Expected Value | Verified |
|-----------|----------------|----------|
| `role` | `"alert"` | [ ] |
| `id` | Matches container's `aria-describedby` | [ ] |

---

## Visual Focus Indicators

| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Focus visible on keyboard navigation | Clear focus ring/outline visible | [ ] |
| Focus indicator meets contrast requirements | 3:1 contrast ratio minimum | [ ] |
| Focus moves visually with arrow keys | Visual focus matches DOM focus | [ ] |

---

## Test Results Summary

**Tester**: _______________
**Date**: _______________
**Browser**: _______________
**Screen Reader**: _______________

### Overall Results
- [ ] All keyboard navigation tests pass
- [ ] All screen reader tests pass
- [ ] All ARIA attributes verified
- [ ] All visual focus indicators verified

### Issues Found
| Issue | Severity | Notes |
|-------|----------|-------|
| | | |
| | | |
| | | |

### Sign-off
- [ ] Component meets WCAG 2.1 AA requirements for keyboard accessibility
- [ ] Component meets WCAG 2.1 AA requirements for screen reader accessibility
- [ ] Component ready for production use

---

## Notes

This manual verification complements the automated property-based tests (Properties 2, 7, 10, 15, 16) which verify ARIA attributes are set correctly. Manual testing confirms that assistive technologies actually interpret and announce these attributes as expected.
