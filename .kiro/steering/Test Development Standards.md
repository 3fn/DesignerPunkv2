---
inclusion: manual
---

# Test Development Standards

**Date**: December 17, 2025
**Last Reviewed**: December 17, 2025
**Purpose**: Establish sustainable test development practices that support system evolution
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: all-tasks

## AI Agent Reading Priorities

**This document contains essential testing guidance and specialized patterns. Read strategically based on your current work.**

**Layer Context**: This is a Layer 2 (Frameworks and Patterns) document that provides reusable testing standards. It's conditionally loaded and contains sections for different testing scenarios.

### WHEN Writing New Tests THEN Read:
1. ✅ **Test Categories** (understand evergreen vs temporary)
2. ✅ **Testing Philosophy** (behavior vs implementation)
3. ✅ **Test Lifecycle Management** (when to write/update/delete)
4. ✅ **Anti-Patterns** (avoid common mistakes)
5. ❌ **SKIP**: Web component patterns (unless testing web components)

### WHEN Testing Web Components THEN Read:
1. ✅ **Web Component Testing Patterns** (JSDOM setup, async lifecycle)
2. ✅ **Anti-Patterns** (web component specific issues)
3. ✅ **Examples from Icon** (concrete patterns)
4. ❌ **SKIP**: Integration testing patterns (unless also doing integration tests)

### WHEN Writing Integration Tests THEN Read:
1. ✅ **Integration Testing Patterns** (contracts vs implementation)
2. ✅ **Testing Philosophy** (behavior vs philosophical preferences)
3. ✅ **Anti-Patterns** (integration test specific issues)
4. ❌ **SKIP**: Web component patterns (unless integrating web components)

### WHEN Debugging Test Failures THEN Read:
1. ✅ **Anti-Patterns** (identify if test has known issues)
2. ✅ **Examples from Icon** (see how similar issues were resolved)
3. ✅ **Testing Philosophy** (understand if test is checking wrong things)
4. ✅ **Relevant pattern section** (web component or integration)

---

## Overview

This document establishes standards for writing maintainable, meaningful tests that support system evolution rather than hinder it. The guidance comes from real-world experience fixing 30 failing Icon tests during the Component Token Compliance Audit (Spec 023).

**Core Principles**:
- Test behavior, not implementation details
- Distinguish evergreen tests from temporary tests
- Avoid testing philosophical preferences
- Manage test lifecycle explicitly
- Use appropriate patterns for web components and integration tests


---

## Test Categories

### Evergreen Tests

**Definition**: Tests that should be maintained indefinitely because they verify core behavior and contracts.

**Characteristics**:
- Test public APIs and contracts
- Verify functional requirements from specs
- Survive refactoring and implementation changes
- Provide long-term value
- Focus on "what" the system does, not "how"

**Examples**:
- `Icon.test.ts` - Tests functional API (`createIcon()`, `Icon` class)
- `Icon.accessibility.test.ts` - Tests ARIA attributes and screen reader compatibility
- Component behavior tests that verify requirements

**When to Create**:
- During feature development
- When implementing new requirements
- When defining public APIs or contracts
- When adding accessibility features

**Maintenance**:
- Update when requirements change
- Update when contracts change
- Keep passing as implementation evolves
- Never delete unless feature is removed

### Temporary Tests

**Definition**: Tests that serve a specific purpose and should be retired after that purpose is fulfilled.

**Characteristics**:
- Verify migration progress or temporary constraints
- Check specific cleanup or refactoring work
- Become maintenance burden after purpose served
- Have explicit retirement criteria
- Focus on temporary state, not permanent behavior

**Examples**:
- Token compliance tests during migration (retire after all components migrated)
- Hard-coded value detection tests during cleanup (retire after cleanup complete)
- Temporary constraint verification during refactoring

**When to Create**:
- During migrations or cleanup work
- When verifying temporary constraints
- When tracking progress toward a goal
- When validating spec-specific work

**Retirement Criteria**:
- Link to spec or task completion
- Document criteria in test comments
- Review after each spec completes
- Delete confidently when criteria met

**Example from Spec 017**:
```typescript
/**
 * TEMPORARY TEST - Delete after cleanup complete
 * Validates ButtonCTA iOS color token replacements
 */
describe('ButtonCTA Token Compliance', () => {
  it('should use color tokens instead of hard-coded values', () => {
    // Test implementation
  });
});
```


### Decision Framework: Evergreen vs Temporary

**Ask these questions**:

1. **Does this test verify permanent behavior?**
   - Yes → Evergreen
   - No → Consider temporary

2. **Will this test provide value in 6 months?**
   - Yes → Evergreen
   - No → Temporary

3. **Is this test checking a temporary constraint?**
   - Yes → Temporary
   - No → Evergreen

4. **Does this test track migration or cleanup progress?**
   - Yes → Temporary
   - No → Evergreen

5. **Would deleting this test after spec completion cause problems?**
   - Yes → Evergreen
   - No → Temporary

**Example Decision Process**:

**Test**: "Icon should use token-based sizing"
- Permanent behavior? Yes (design system principle)
- Value in 6 months? Yes (always want token compliance)
- Temporary constraint? No (permanent requirement)
- **Decision**: Evergreen

**Test**: "Icon should not have hard-coded 24px values"
- Permanent behavior? No (checking absence of specific anti-pattern)
- Value in 6 months? No (after migration, this is guaranteed)
- Temporary constraint? Yes (only matters during migration)
- **Decision**: Temporary (retire after Icon migration complete)

---

## Testing Philosophy

### Test Behavior, Not Implementation

**Principle**: Tests should verify what the system does (behavior) rather than how it does it (implementation).

**Why This Matters**:
- Implementation can change while behavior stays the same
- Tests that check implementation details become brittle
- Refactoring breaks tests even when behavior is correct
- Maintenance burden increases unnecessarily

**Behavior vs Implementation**:

| Behavior (Test This) | Implementation (Don't Test This) |
|---------------------|----------------------------------|
| Icon renders at 24px size | Icon has `width="24"` attribute |
| Button responds to clicks | Button uses specific event handler |
| Component is accessible | Component uses specific ARIA pattern |
| Data is validated | Validation uses specific regex |

**Example from Icon Tests**:

❌ **Bad - Tests Implementation**:
```typescript
it('should have width and height attributes', () => {
  const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
  expect(iconHTML).toContain('width="24"');
  expect(iconHTML).toContain('height="24"');
});
```

**Problem**: This test assumes Icon uses inline attributes. When Icon switched to CSS classes for token-based sizing, the test failed even though Icon still renders at 24px.

✅ **Good - Tests Behavior**:
```typescript
it('should render with correct size class', () => {
  const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
  expect(iconHTML).toContain('icon--size-100');
});
```

**Better**: This test verifies Icon applies the correct CSS class for 24px sizing, which is the actual contract.


### Test Contracts, Not Details

**Principle**: Tests should verify the contract (interface, API, behavior) rather than internal details.

**Contract**: The agreement between a component and its consumers about what it provides and how to use it.

**Internal Details**: Implementation choices that don't affect the contract.

**Example from ButtonCTA Integration**:

**Contract**: ButtonCTA renders icons at appropriate sizes for button variants
- Small/medium buttons: 24px icons
- Large buttons: 32px icons

**Internal Detail**: How Icon implements sizing (CSS classes vs inline attributes)

❌ **Bad - Tests Internal Detail**:
```typescript
it('should use correct icon size for small buttons', () => {
  const button = createButtonCTA({ size: 'small', icon: 'arrow-right' });
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Tests how Icon implements sizing (internal detail)
  expect(iconSpan!.innerHTML).toContain('width="24"');
  expect(iconSpan!.innerHTML).toContain('height="24"');
});
```

✅ **Good - Tests Contract**:
```typescript
it('should use correct icon size for small buttons', () => {
  const button = createButtonCTA({ size: 'small', icon: 'arrow-right' });
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Tests that Icon receives correct size (contract)
  expect(iconSpan!.innerHTML).toContain('icon--size-100'); // 24px
});
```

**Why This Matters**: When Icon changed from inline attributes to CSS classes, the contract didn't change (still renders 24px icons), but tests checking internal details failed.

### Don't Test Philosophical Preferences

**Principle**: Avoid tests that check opinions about code structure rather than functional requirements.

**Philosophical Preference**: Opinion about how code should be organized or structured
**Functional Requirement**: Specification of what the system must do

**Examples of Philosophical Tests to Avoid**:

❌ **"Components must use CSS classes for sizing"**
- This is a preference about implementation approach
- Not a functional requirement
- Becomes brittle if implementation changes

❌ **"All values must come from tokens"**
- After migration, this is guaranteed by architecture
- Testing it becomes philosophical rather than functional
- Better to test that values are correct, not their source

❌ **"Code must follow specific pattern"**
- Unless pattern affects behavior, this is preference
- Tests should verify behavior, not code style

**Examples of Functional Tests to Keep**:

✅ **"Icon renders at 24px when size prop is 24"**
- Verifies functional behavior
- Doesn't care about implementation
- Survives refactoring

✅ **"ButtonCTA icon matches button size variant"**
- Verifies integration contract
- Doesn't dictate how sizing is implemented
- Tests actual requirement

✅ **"Components are accessible to screen readers"**
- Verifies functional requirement
- Doesn't dictate specific ARIA pattern
- Tests user-facing behavior


**Decision Framework: Functional vs Philosophical**:

1. **Is this specified in requirements?**
   - Yes → Functional (test it)
   - No → Might be philosophical

2. **Does this affect user-facing behavior?**
   - Yes → Functional (test it)
   - No → Likely philosophical (don't test)

3. **Would changing this break the contract?**
   - Yes → Functional (test it)
   - No → Philosophical (don't test)

4. **Is this an opinion about code structure?**
   - Yes → Philosophical (don't test)
   - No → Functional (test it)

**Example Decision Process**:

**Test**: "Icon should use CSS classes for sizing"
- Specified in requirements? No (requirements say "render at correct size")
- Affects user behavior? No (users see correct size either way)
- Breaks contract if changed? No (contract is "render at size X")
- Opinion about structure? Yes (preference for CSS over attributes)
- **Decision**: Philosophical - Don't test

**Test**: "Icon should render at correct size"
- Specified in requirements? Yes (size prop requirement)
- Affects user behavior? Yes (users see wrong size if broken)
- Breaks contract if changed? Yes (size is part of API contract)
- Opinion about structure? No (functional requirement)
- **Decision**: Functional - Test it

---

## Web Component Testing Patterns

### JSDOM and Custom Elements

**Challenge**: Web components require proper setup in Jest/JSDOM test environment.

**Key Issues**:
- Custom element registration timing
- Async lifecycle callbacks (`connectedCallback`, `attributeChangedCallback`)
- Shadow DOM rendering
- `customElements.whenDefined()` usage

### Pattern: Explicit Custom Element Registration

**Problem**: Tests fail because custom element isn't registered or ready when test runs.

**Solution**: Explicitly register and wait for custom element definition.

**Implementation**:

```typescript
import { DPIcon } from '../Icon.web';

describe('Icon Web Component Lifecycle', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('dp-icon')) {
      customElements.define('dp-icon', DPIcon);
    }
  });

  beforeEach(async () => {
    // Wait for custom element to be defined
    await customElements.whenDefined('dp-icon');
  });

  it('should render icon when added to DOM', async () => {
    const element = document.createElement('dp-icon') as DPIcon;
    element.setAttribute('name', 'arrow-right');
    element.setAttribute('size', '24');
    
    document.body.appendChild(element);
    
    // Wait for connectedCallback to fire and render
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
    
    // Cleanup
    document.body.removeChild(element);
  });
});
```

**Key Elements**:
1. **`beforeAll()`**: Register custom element once for all tests
2. **`beforeEach()`**: Wait for element definition before each test
3. **`async/await`**: Make tests async to handle lifecycle timing
4. **`setTimeout(resolve, 0)`**: Wait one tick for `connectedCallback` to fire
5. **Cleanup**: Remove elements from DOM after each test


### Pattern: Shadow DOM Querying

**Problem**: `element.shadowRoot?.querySelector()` returns `undefined` even though element is in DOM.

**Root Cause**: Shadow DOM isn't rendered yet because `connectedCallback` hasn't fired or completed.

**Solution**: Wait for async lifecycle before querying shadow DOM.

**Implementation**:

```typescript
it('should render SVG in shadow DOM', async () => {
  await customElements.whenDefined('dp-icon');
  
  const element = document.createElement('dp-icon') as DPIcon;
  element.setAttribute('name', 'check');
  document.body.appendChild(element);
  
  // Critical: Wait for connectedCallback to complete
  await new Promise(resolve => setTimeout(resolve, 0));
  
  // Now shadow DOM is ready
  const svg = element.shadowRoot?.querySelector('svg');
  expect(svg).toBeTruthy();
  expect(svg?.classList.contains('icon')).toBe(true);
  
  document.body.removeChild(element);
});
```

**Why This Works**:
- `customElements.whenDefined()` ensures element class is registered
- `appendChild()` triggers `connectedCallback` asynchronously
- `setTimeout(resolve, 0)` waits one event loop tick for callback to complete
- Shadow DOM is now rendered and queryable

### Pattern: Attribute Change Testing

**Problem**: Tests for `attributeChangedCallback` fail because changes don't trigger re-render.

**Solution**: Wait after attribute changes for callback to fire.

**Implementation**:

```typescript
it('should update when size attribute changes', async () => {
  await customElements.whenDefined('dp-icon');
  
  const element = document.createElement('dp-icon') as DPIcon;
  element.setAttribute('name', 'arrow-right');
  element.setAttribute('size', '24');
  document.body.appendChild(element);
  
  await new Promise(resolve => setTimeout(resolve, 0));
  
  // Verify initial state
  let svg = element.shadowRoot?.querySelector('svg');
  expect(svg?.classList.contains('icon--size-100')).toBe(true);
  
  // Change attribute
  element.setAttribute('size', '32');
  
  // Wait for attributeChangedCallback to fire
  await new Promise(resolve => setTimeout(resolve, 0));
  
  // Verify updated state
  svg = element.shadowRoot?.querySelector('svg');
  expect(svg?.classList.contains('icon--size-200')).toBe(true);
  
  document.body.removeChild(element);
});
```

**Key Points**:
- Wait after initial `appendChild()` for first render
- Wait after `setAttribute()` for re-render
- Query shadow DOM after each wait
- Verify state changes correctly

### Common JSDOM Limitations

**What Works**:
- `customElements.define()` and `customElements.get()`
- Basic custom element creation with `document.createElement()`
- Shadow DOM attachment with `attachShadow()`
- `customElements.whenDefined()` promise

**What Has Limitations**:
- Lifecycle callbacks may not fire reliably without explicit waits
- Shadow DOM rendering may not work exactly like real browsers
- Timing issues with when custom elements become "defined"
- `connectedCallback` may not fire when element is added to document

**Best Practices**:
- Always use `customElements.whenDefined()` before creating elements
- Always wait after `appendChild()` before querying shadow DOM
- Always wait after `setAttribute()` before checking for changes
- Make all web component tests async
- Clean up elements after each test


---

## Integration Testing Patterns

### What to Verify in Integration Tests

**Integration tests** verify that components work together correctly, not that individual components work in isolation.

**Focus on**:
- Component A correctly calls Component B's API
- Component A passes correct props/parameters to Component B
- Component A handles Component B's output correctly
- Integration contract is maintained

**Don't focus on**:
- How Component B implements its functionality
- Internal details of Component B's rendering
- Specific implementation choices in Component B

### Pattern: Test Integration Contract

**Example from ButtonCTA + Icon Integration**:

**Contract**: ButtonCTA renders icons at appropriate sizes
- Small/medium buttons → 24px icons (`iconSizes.size100`)
- Large buttons → 32px icons (`iconSizes.size125`)

✅ **Good - Tests Contract**:
```typescript
it('should use correct icon size for small buttons', () => {
  const button = createButtonCTA({ 
    size: 'small', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Verify ButtonCTA called createIcon with correct size
  // Check for CSS class that corresponds to 24px
  expect(iconSpan!.innerHTML).toContain('icon--size-100');
});

it('should use correct icon size for large buttons', () => {
  const button = createButtonCTA({ 
    size: 'large', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Verify ButtonCTA called createIcon with correct size
  // Check for CSS class that corresponds to 32px
  expect(iconSpan!.innerHTML).toContain('icon--size-200');
});
```

**What This Tests**:
- ✅ ButtonCTA imports and calls `createIcon` correctly
- ✅ ButtonCTA passes correct size parameter based on button size
- ✅ Icon markup is inserted into button's shadow DOM
- ✅ Integration contract is maintained

**What This Doesn't Test**:
- ❌ How Icon implements sizing (CSS classes vs attributes)
- ❌ Icon's internal rendering logic
- ❌ Specific pixel values in Icon's output

### Pattern: Avoid Testing Implementation Details

❌ **Bad - Tests Implementation Details**:
```typescript
it('should render icon with inline width/height attributes', () => {
  const button = createButtonCTA({ 
    size: 'small', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // This tests HOW Icon implements sizing (implementation detail)
  expect(iconSpan!.innerHTML).toContain('width="24"');
  expect(iconSpan!.innerHTML).toContain('height="24"');
});
```

**Problems**:
- Test assumes Icon uses inline attributes
- Test breaks when Icon changes to CSS-based sizing
- Test doesn't verify the actual contract (correct size)
- Test is brittle and creates maintenance burden

**Why This Failed**: When Icon switched from inline attributes to CSS classes for token-based sizing, these tests failed even though:
- ButtonCTA still works correctly
- Icons still render at correct sizes
- Integration contract is maintained
- No functional regression occurred


### Pattern: Token-Based Design Considerations

**Challenge**: When components use token-based design, tests need to verify token usage without checking implementation details.

**Approach**: Test that correct token references are used, not specific pixel values.

**Example**:

✅ **Good - Tests Token Usage**:
```typescript
it('should use icon size tokens for sizing', () => {
  const button = createButtonCTA({ 
    size: 'small', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Verify token-based CSS class is applied
  // This tests the contract: "use token-based sizing"
  expect(iconSpan!.innerHTML).toContain('icon--size-100');
});
```

❌ **Bad - Tests Pixel Values**:
```typescript
it('should render 24px icon', () => {
  const button = createButtonCTA({ 
    size: 'small', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // This tests specific pixel value (implementation detail)
  expect(iconSpan!.innerHTML).toContain('width="24"');
});
```

**Why Token-Based Approach is Better**:
- Tests verify design system compliance
- Tests survive implementation changes
- Tests check actual contract (token usage)
- Tests align with design system principles

### Integration Test Checklist

When writing integration tests, ask:

1. **Am I testing the integration contract?**
   - Yes → Good test
   - No → Might be testing wrong thing

2. **Am I testing how Component B works internally?**
   - Yes → Bad test (test Component B directly instead)
   - No → Good test

3. **Would this test break if Component B's implementation changed but contract stayed the same?**
   - Yes → Bad test (too brittle)
   - No → Good test

4. **Am I checking that Component A correctly uses Component B's API?**
   - Yes → Good test
   - No → Might be missing the point

5. **Am I verifying specific implementation details?**
   - Yes → Bad test (too coupled)
   - No → Good test

---

## Anti-Patterns

### Anti-Pattern 1: Testing Implementation Details

**Problem**: Tests check how something is implemented rather than what it does.

**Example from Icon Tests**:

❌ **Bad**:
```typescript
it('should have width and height attributes', () => {
  const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
  expect(iconHTML).toContain('width="24"');
  expect(iconHTML).toContain('height="24"');
});
```

**Why This is Bad**:
- Assumes specific implementation (inline attributes)
- Breaks when implementation changes to CSS classes
- Doesn't test actual requirement (correct size)
- Creates maintenance burden

✅ **Good**:
```typescript
it('should apply correct size class', () => {
  const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
  expect(iconHTML).toContain('icon--size-100');
});
```

**Why This is Better**:
- Tests actual contract (CSS class for sizing)
- Survives implementation changes
- Verifies token-based design
- Aligns with design system principles


### Anti-Pattern 2: Assuming Synchronous Web Component Rendering

**Problem**: Tests query shadow DOM immediately after creating element, before `connectedCallback` fires.

**Example from Icon Tests**:

❌ **Bad**:
```typescript
it('should render icon when added to DOM', () => {
  const element = document.createElement('dp-icon') as DPIcon;
  element.setAttribute('name', 'arrow-right');
  document.body.appendChild(element);
  
  // This fails because connectedCallback hasn't fired yet
  const svg = element.shadowRoot?.querySelector('svg');
  expect(svg).toBeTruthy(); // FAILS - svg is undefined
});
```

**Why This Fails**:
- Web component lifecycle is asynchronous
- `connectedCallback` doesn't fire immediately
- Shadow DOM isn't rendered yet
- `querySelector` returns `undefined`

✅ **Good**:
```typescript
it('should render icon when added to DOM', async () => {
  await customElements.whenDefined('dp-icon');
  
  const element = document.createElement('dp-icon') as DPIcon;
  element.setAttribute('name', 'arrow-right');
  document.body.appendChild(element);
  
  // Wait for connectedCallback to fire
  await new Promise(resolve => setTimeout(resolve, 0));
  
  // Now shadow DOM is ready
  const svg = element.shadowRoot?.querySelector('svg');
  expect(svg).toBeTruthy(); // PASSES
  
  document.body.removeChild(element);
});
```

**Why This Works**:
- Uses `customElements.whenDefined()` to ensure element is registered
- Waits one tick after `appendChild()` for lifecycle to complete
- Shadow DOM is rendered before querying
- Cleans up after test

### Anti-Pattern 3: Missing Custom Element Registration

**Problem**: Tests assume custom element is registered but don't verify or ensure it.

**Example from Icon Tests**:

❌ **Bad**:
```typescript
describe('Icon Web Component', () => {
  it('should render', () => {
    // Assumes dp-icon is registered, but doesn't verify
    const element = document.createElement('dp-icon') as DPIcon;
    // Test fails because element isn't actually a DPIcon instance
  });
});
```

**Why This Fails**:
- Custom element might not be registered in test environment
- `document.createElement('dp-icon')` returns `HTMLElement`, not `DPIcon`
- Element doesn't have custom element behavior
- Tests fail with confusing errors

✅ **Good**:
```typescript
describe('Icon Web Component', () => {
  beforeAll(() => {
    // Explicitly register custom element
    if (!customElements.get('dp-icon')) {
      customElements.define('dp-icon', DPIcon);
    }
  });

  beforeEach(async () => {
    // Wait for element to be defined
    await customElements.whenDefined('dp-icon');
  });

  it('should render', async () => {
    const element = document.createElement('dp-icon') as DPIcon;
    // Now element is actually a DPIcon instance
    document.body.appendChild(element);
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
    
    document.body.removeChild(element);
  });
});
```

**Why This Works**:
- Explicitly registers custom element before tests
- Waits for element definition before each test
- Element has correct type and behavior
- Tests are reliable and predictable


### Anti-Pattern 4: Testing Before Design is Finalized

**Problem**: Writing tests based on assumptions about implementation before design is complete.

**Example from Icon Tests**:

❌ **Bad Timing**:
```typescript
// Written during initial development, assuming inline attributes
it('should have width and height attributes', () => {
  const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
  expect(iconHTML).toContain('width="24"');
});

// Later, design changes to CSS-based sizing
// Test now fails even though Icon works correctly
```

**Why This is Problematic**:
- Tests lock in implementation details too early
- Design evolution breaks tests unnecessarily
- Tests become maintenance burden
- Refactoring is harder

✅ **Better Approach**:
```typescript
// Wait until design is stable, then test contracts
it('should apply correct size class for token-based sizing', () => {
  const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
  expect(iconHTML).toContain('icon--size-100');
});
```

**Best Practices**:
- Write tests after design is finalized
- Test contracts and behavior, not implementation
- Update tests when design changes intentionally
- Delete tests that no longer serve a purpose

### Anti-Pattern 5: Checking Wrong Integration Details

**Problem**: Integration tests check how integrated component works internally instead of checking integration contract.

**Example from ButtonCTA Integration Tests**:

❌ **Bad**:
```typescript
it('should render icon with inline attributes', () => {
  const button = createButtonCTA({ 
    size: 'small', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Checks Icon's internal implementation
  expect(iconSpan!.innerHTML).toContain('width="24"');
  expect(iconSpan!.innerHTML).toContain('height="24"');
});
```

**Why This is Bad**:
- Tests Icon's implementation, not ButtonCTA's integration
- Breaks when Icon changes implementation
- Doesn't verify ButtonCTA's responsibility
- Creates coupling between tests and Icon internals

✅ **Good**:
```typescript
it('should use correct icon size for small buttons', () => {
  const button = createButtonCTA({ 
    size: 'small', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Checks ButtonCTA's integration contract
  expect(iconSpan!.innerHTML).toContain('icon--size-100');
});
```

**Why This is Better**:
- Tests ButtonCTA's responsibility (passing correct size)
- Survives Icon implementation changes
- Verifies integration contract
- Focuses on what ButtonCTA controls

---

## Test Lifecycle Management

### When to Write Tests

**During Feature Development**:
- Write evergreen tests for new features
- Test public APIs and contracts
- Verify functional requirements
- Add accessibility tests

**During Migration/Cleanup**:
- Write temporary tests to track progress
- Document retirement criteria in test comments
- Link tests to spec completion
- Plan for deletion after spec completes

**After Design Changes**:
- Update existing tests to match new contracts
- Delete tests that check old implementation details
- Add tests for new behavior
- Verify tests still provide value


### When to Update Tests

**Requirements Change**:
- Update tests to match new requirements
- Verify new behavior is tested
- Remove tests for removed features
- Update test documentation

**Contracts Change**:
- Update tests to match new contracts
- Verify integration tests still work
- Update API tests for new signatures
- Document breaking changes

**Tests Fail Due to Refactoring**:
- Evaluate if test is too brittle
- Check if test tests implementation details
- Update test to check behavior instead
- Consider if test should be deleted

**Design Evolution**:
- Update tests to match evolved design
- Remove tests for old implementation details
- Add tests for new patterns
- Verify tests align with current architecture

### When to Delete Tests

**Temporary Tests After Purpose Served**:
- Migration complete → Delete migration tests
- Cleanup complete → Delete cleanup verification tests
- Spec complete → Delete spec-specific temporary tests
- Review retirement criteria → Delete if met

**Tests That Check Implementation Details**:
- Implementation changed → Delete tests checking old details
- Design evolved → Delete tests for old patterns
- Refactoring complete → Delete tests that were too brittle

**Tests That Provide No Value**:
- Philosophical tests → Delete tests checking opinions
- Duplicate tests → Delete redundant tests
- Obsolete tests → Delete tests for removed features

**Tests That Create Maintenance Burden**:
- Brittle tests → Delete tests that break on every refactor
- Over-specific tests → Delete tests checking too many details
- Coupled tests → Delete tests too tightly coupled to implementation

### Retirement Criteria for Temporary Tests

**Document Criteria in Test Comments**:
```typescript
/**
 * TEMPORARY TEST - Delete after Icon token migration complete
 * 
 * Retirement Criteria:
 * - All Icon platform implementations use token-based sizing
 * - Icon README documents token consumption
 * - Spec 023 Task 2 marked complete
 * 
 * This test verifies Icon uses CSS classes for sizing during migration.
 * After migration, this is guaranteed by architecture and doesn't need testing.
 */
describe('Icon Token Compliance (TEMPORARY)', () => {
  it('should use token-based CSS classes for sizing', () => {
    const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
    expect(iconHTML).toContain('icon--size-100');
  });
});
```

**Review After Spec Completion**:
1. Check if retirement criteria are met
2. Verify feature is complete and stable
3. Confirm tests no longer provide value
4. Delete confidently with clear commit message

**Example Deletion Commit**:
```
Delete temporary Icon token compliance tests

Retirement criteria met:
- Icon token migration complete (Spec 023 Task 2)
- All platforms use token-based sizing
- Icon README documents token consumption

These tests verified migration progress and are no longer needed.
Token compliance is now guaranteed by architecture.
```


---

## Examples from Icon

### Example 1: Icon.test.ts (Evergreen Tests) ✅

**What It Tests**: Functional API (`createIcon()`, `Icon` class)

**Why It's Evergreen**:
- Tests public API contracts
- Verifies functional requirements
- Survives implementation changes
- Provides long-term value

**Key Tests**:
```typescript
describe('createIcon', () => {
  it('should create icon with correct name', () => {
    const result = createIcon({ name: 'arrow-right', size: 24 });
    expect(result).toContain('icon-arrow-right');
  });

  it('should apply correct size class', () => {
    const result = createIcon({ name: 'check', size: 24 });
    expect(result).toContain('icon--size-100');
  });
});
```

**Lessons**:
- Focus on API contracts
- Test behavior, not implementation
- Keep tests simple and focused
- Verify functional requirements

### Example 2: Icon.lifecycle.test.ts (Fixed) ✅

**What It Tests**: Web component lifecycle callbacks

**Original Problem**: Missing async setup, tests failed with `undefined` shadow DOM

**Fix Applied**:
```typescript
describe('Icon Web Component Lifecycle', () => {
  beforeAll(() => {
    if (!customElements.get('dp-icon')) {
      customElements.define('dp-icon', DPIcon);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('dp-icon');
  });

  it('should render icon when added to DOM', async () => {
    const element = document.createElement('dp-icon') as DPIcon;
    element.setAttribute('name', 'arrow-right');
    document.body.appendChild(element);
    
    // Critical: Wait for connectedCallback
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const svg = element.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
    
    document.body.removeChild(element);
  });
});
```

**Lessons**:
- Explicitly register custom elements
- Use `customElements.whenDefined()`
- Wait for async lifecycle callbacks
- Clean up after each test

### Example 3: Icon.buttonCTA-integration.test.ts (Fixed) ✅

**What It Tests**: ButtonCTA + Icon integration

**Original Problem**: Tests checked for inline attributes instead of CSS classes

**Fix Applied**:
```typescript
it('should use correct icon size for small buttons', () => {
  const button = createButtonCTA({ 
    size: 'small', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Changed from: expect(...).toContain('width="24"')
  // To: Check CSS class for token-based sizing
  expect(iconSpan!.innerHTML).toContain('icon--size-100');
});

it('should use correct icon size for large buttons', () => {
  const button = createButtonCTA({ 
    size: 'large', 
    icon: 'arrow-right',
    label: 'Next'
  });
  
  const iconSpan = button.querySelector('.button-cta__icon');
  
  // Changed from: expect(...).toContain('width="32"')
  // To: Check CSS class for token-based sizing
  expect(iconSpan!.innerHTML).toContain('icon--size-200');
});
```

**Lessons**:
- Test integration contracts, not implementation details
- Check for token-based CSS classes, not pixel values
- Verify what component controls, not how dependencies work
- Update tests when design evolves


### Summary: Icon Test Fixes

**Total Tests**: 103 (all passing after fixes)

**Issues Fixed**:
1. **Web Component Registration** (24 tests):
   - Added explicit `customElements.define()`
   - Added `customElements.whenDefined()` waits
   - Added async delays for lifecycle callbacks
   - Fixed `Icon.lifecycle.test.ts` and `Icon.rendering.test.ts`

2. **Integration Test Expectations** (6 tests):
   - Changed from checking inline attributes to CSS classes
   - Updated to verify token-based sizing approach
   - Fixed `Icon.buttonCTA-integration.test.ts`

**Key Takeaways**:
- Web component tests need explicit async handling
- Integration tests should check contracts, not implementation
- Tests should align with design system principles
- Fixing tests revealed broader patterns worth documenting

---

## Cross-References

### Component Development Guide
**File**: `.kiro/steering/Component Development Guide.md`

**Related Content**:
- Component testing patterns
- Token-based design testing considerations
- Cross-platform testing strategies

**When to Reference**: When writing component-specific tests or understanding component architecture.

### Spec 017 Design Document
**File**: `.kiro/specs/017-component-code-quality-sweep/design.md`

**Related Content**:
- Test lifecycle and maintenance philosophy
- Temporary vs permanent test distinctions
- Three-tier testing strategy (cleanup-specific, evergreen, existing)

**When to Reference**: When planning cleanup or migration work that requires temporary tests.

### Development Workflow
**File**: `.kiro/steering/Development Workflow.md`

**Related Content**:
- Test execution practices
- Jest command usage
- Test validation during task completion

**When to Reference**: When running tests or validating task completion.

### Icon Test Investigation
**File**: `.kiro/specs/023-component-token-compliance-audit/findings/icon-test-investigation.md`

**Related Content**:
- Detailed root cause analysis of Icon test failures
- Complete fix implementation details
- JSDOM and custom element compatibility notes

**When to Reference**: When debugging similar web component test issues or understanding the full context of Icon test fixes.

---

## Quality Standards

**Test Quality Checklist**:

- ✅ Tests verify behavior, not implementation details
- ✅ Tests check contracts, not internal details
- ✅ Tests avoid philosophical preferences
- ✅ Evergreen tests have long-term value
- ✅ Temporary tests have documented retirement criteria
- ✅ Web component tests use proper async setup
- ✅ Integration tests focus on integration contracts
- ✅ Tests survive refactoring and design evolution
- ✅ Tests align with design system principles
- ✅ Tests are maintainable and provide clear value

**Review Questions**:

1. **Does this test verify a functional requirement?**
2. **Will this test survive implementation changes?**
3. **Is this test checking behavior or implementation?**
4. **Should this test be evergreen or temporary?**
5. **Does this test provide long-term value?**
6. **Is this test properly handling async behavior?**
7. **Is this integration test checking the right contract?**
8. **Would I want to maintain this test in 6 months?**

---

*This document captures lessons learned from fixing 30 failing Icon tests during Spec 023 (Component Token Compliance Audit). The patterns and anti-patterns documented here apply to all component testing in the DesignerPunk design system.*

