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
6. ❌ **SKIP**: Linting integration (unless using Stemma validators)

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

### WHEN Using Stemma System Validators THEN Read:
1. ✅ **Linting and Testing Integration** (when to use linting vs testing)
2. ✅ **Stemma System Validators** (available validators and usage)
3. ✅ **Decision Framework: Linting vs Testing** (choose validation type)
4. ✅ **Complementary Validation Patterns** (combine linting and testing)
5. ✅ **Stemma System Validation Checklist** (complete validation workflow)

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

## Linting and Testing Integration

### Overview

The Stemma System introduces static analysis validators that complement runtime testing. Understanding when to use linting vs testing is essential for efficient validation without duplicating effort.

**Dual Validation Approach**:
- **Static Analysis (Linting)**: Validates structure, naming, and configuration at development time
- **Runtime Testing**: Validates behavior, contracts, and interactions during test execution
- **Together**: Comprehensive coverage with minimal redundancy

### Validation Types

| Validation Type | Mechanism | When Applied | What It Validates |
|-----------------|-----------|--------------|-------------------|
| **Static Analysis** | Linting/Validators | During development (IDE) | Structure, naming, configuration |
| **Unit Tests** | Runtime | During test execution | Specific examples, edge cases |
| **Integration Tests** | Runtime | During test execution | Component interaction, contracts |
| **Property Tests** | Runtime | During test execution | Universal properties across inputs |
| **Manual Validation** | Human review | During development | Documentation quality, UX |

### Stemma System Validators

The Stemma System provides four validators for static analysis:

| Validator | Purpose | What It Catches |
|-----------|---------|-----------------|
| **StemmaComponentNamingValidator** | Naming convention compliance | Invalid [Family]-[Type]-[Variant] patterns, missing Base suffix |
| **StemmaTokenUsageValidator** | Token usage compliance | Inline styles, hard-coded values, missing token references |
| **StemmaPropertyAccessibilityValidator** | Property and accessibility | Missing required properties, WCAG violations |
| **StemmaErrorGuidanceSystem** | Error guidance | Provides correction guidance and documentation links |

**Import Example**:
```typescript
import {
  validateComponentName,
  validateTokenUsage,
  validatePropertyAndAccessibility,
  getErrorGuidance
} from '../validators';
```

### When to Use Linting vs Testing

#### Use Linting (Static Analysis) For:

**Structural Validation**:
- Component naming convention compliance
- Token usage patterns (detecting inline styles)
- Required property presence
- Schema compliance
- Configuration validation

**Why Linting is Better**:
- Immediate feedback during development
- No runtime overhead
- Catches issues before tests run
- Consistent enforcement across codebase

**Example - Naming Convention**:
```typescript
// Linting catches this immediately
const result = validateComponentName('ButtonPrimary');
// Error: Missing family prefix, should be "Button-CTA-Primary" or similar
```

#### Use Testing (Runtime) For:

**Behavioral Validation**:
- Component renders correctly
- User interactions work as expected
- Integration contracts are honored
- Accessibility features function properly
- Cross-platform consistency

**Why Testing is Better**:
- Validates actual behavior
- Tests real user scenarios
- Catches runtime issues
- Verifies integration contracts

**Example - Behavior**:
```typescript
// Testing validates actual behavior
it('should render icon at correct size', () => {
  const button = createButtonCTA({ size: 'small', icon: 'arrow-right' });
  const icon = button.querySelector('.button-cta__icon');
  expect(icon!.innerHTML).toContain('icon--size-100');
});
```

### Decision Framework: Linting vs Testing

**Ask these questions to determine validation type**:

1. **Can this be validated without running code?**
   - Yes → Linting
   - No → Testing

2. **Is this about structure or behavior?**
   - Structure → Linting
   - Behavior → Testing

3. **Does this require user interaction simulation?**
   - Yes → Testing
   - No → Consider linting

4. **Is this checking a naming convention or pattern?**
   - Yes → Linting
   - No → Testing

5. **Does this need to verify runtime state?**
   - Yes → Testing
   - No → Linting

**Decision Matrix**:

| Validation Need | Linting | Testing | Both |
|-----------------|---------|---------|------|
| Component naming | ✅ | | |
| Token usage patterns | ✅ | | |
| Required properties present | ✅ | | |
| Schema compliance | ✅ | | |
| Component renders correctly | | ✅ | |
| User interactions work | | ✅ | |
| Integration contracts honored | | ✅ | |
| Accessibility features work | | ✅ | |
| WCAG compliance | ✅ | ✅ | ✅ |
| Cross-platform consistency | | ✅ | |
| Token values are correct | | ✅ | |

### Complementary Validation Patterns

#### Pattern 1: Linting + Unit Tests

**Use Case**: Component development with structural and behavioral validation

**Linting Validates**:
- Component name follows [Family]-[Type]-[Variant] pattern
- Token references are used (no inline styles)
- Required properties are defined in schema

**Unit Tests Validate**:
- Component renders with correct output
- Properties affect rendering correctly
- Edge cases are handled

**Example**:
```typescript
// Linting (static analysis)
const namingResult = validateComponentName('Input-Text-Email');
// ✅ Valid: Family=Input, Type=Text, Variant=Email

// Unit Test (runtime)
it('should render email input with correct type', () => {
  const input = createInputTextEmail({ label: 'Email' });
  expect(input.getAttribute('type')).toBe('email');
});
```

#### Pattern 2: Linting + Integration Tests

**Use Case**: Component integration with contract validation

**Linting Validates**:
- Both components follow naming conventions
- Token usage is consistent
- Properties match schema contracts

**Integration Tests Validate**:
- Components work together correctly
- Integration contracts are honored
- Data flows correctly between components

**Example**:
```typescript
// Linting (static analysis)
const buttonResult = validateComponentName('Button-CTA');
const iconResult = validateComponentName('Icon-Base');
// ✅ Both valid

// Integration Test (runtime)
it('should render button with icon at correct size', () => {
  const button = createButtonCTA({ icon: 'arrow-right', size: 'small' });
  const iconSpan = button.querySelector('.button-cta__icon');
  expect(iconSpan!.innerHTML).toContain('icon--size-100');
});
```

#### Pattern 3: Linting + Property Tests

**Use Case**: Universal property validation across inputs

**Linting Validates**:
- Component structure is correct
- Token patterns are followed
- Schema is valid

**Property Tests Validate**:
- Properties hold for all valid inputs
- Invariants are maintained
- Contracts are universally honored

**Example**:
```typescript
// Linting (static analysis)
const schemaResult = validatePropertyAndAccessibility(
  'Input-Text-Base',
  { label: 'Test', value: '' },
  schema
);
// ✅ Required properties present

// Property Test (runtime)
it.prop([fc.string().filter(s => s.trim().length > 0)])(
  'should always render label for non-empty strings',
  (label) => {
    const input = createInputTextBase({ label });
    const labelElement = input.querySelector('label');
    expect(labelElement?.textContent).toBe(label);
  }
);
```

### Avoiding Validation Duplication

**Anti-Pattern**: Testing what linting already validates

❌ **Bad - Duplicates Linting**:
```typescript
// Linting already validates naming convention
it('should have correct component name format', () => {
  expect(componentName).toMatch(/^[A-Z][a-z]+-[A-Z][a-z]+-[A-Z][a-z]+$/);
});
```

✅ **Good - Tests Behavior**:
```typescript
// Test actual behavior, not naming
it('should render with correct accessibility attributes', () => {
  const input = createInputTextEmail({ label: 'Email' });
  expect(input.getAttribute('aria-label')).toBe('Email');
});
```

**Anti-Pattern**: Linting what requires runtime validation

❌ **Bad - Can't Lint Behavior**:
```typescript
// Can't validate rendering without running code
const result = validateComponentRendersCorrectly('Button-CTA');
```

✅ **Good - Test Behavior**:
```typescript
// Test actual rendering behavior
it('should render button with correct variant class', () => {
  const button = createButtonCTA({ variant: 'primary' });
  expect(button.classList.contains('button-cta--primary')).toBe(true);
});
```

### Validation Workflow

**Recommended Order**:

1. **Pre-Development**: Schema validation (linting)
   - Validate component schema structure
   - Check naming convention compliance
   - Verify token references

2. **During Development**: Real-time linting (IDE)
   - Immediate feedback on naming issues
   - Token usage validation
   - Property completeness checks

3. **Post-Development**: Test execution (runtime)
   - Unit tests for specific behavior
   - Integration tests for contracts
   - Property tests for universal properties

4. **Pre-Merge**: Complete validation suite
   - All linting passes
   - All tests pass
   - Manual review complete

### Stemma System Validation Checklist

**For New Components**:

- [ ] **Naming**: `validateComponentName()` passes
- [ ] **Token Usage**: `validateTokenUsage()` passes
- [ ] **Properties**: `validatePropertyAndAccessibility()` passes
- [ ] **Unit Tests**: Core behavior tested
- [ ] **Integration Tests**: Contracts with dependencies tested
- [ ] **Accessibility Tests**: WCAG compliance verified

**For Component Updates**:

- [ ] **Linting**: All validators still pass
- [ ] **Existing Tests**: All tests still pass
- [ ] **New Behavior**: New tests added for new behavior
- [ ] **Contracts**: Integration contracts still honored

### Cross-Reference to Validators

**Validator Source Files**:
- `src/validators/StemmaComponentNamingValidator.ts` - Naming convention validation
- `src/validators/StemmaTokenUsageValidator.ts` - Token usage validation
- `src/validators/StemmaPropertyAccessibilityValidator.ts` - Property and accessibility validation
- `src/validators/StemmaErrorGuidanceSystem.ts` - Error guidance and IDE integration

**Validator Tests**:
- `src/validators/__tests__/StemmaComponentNamingValidator.test.ts`
- `src/validators/__tests__/StemmaTokenUsageValidator.test.ts`
- `src/validators/__tests__/StemmaPropertyAccessibilityValidator.test.ts`
- `src/validators/__tests__/StemmaErrorGuidanceSystem.test.ts`

**Behavioral Contract Tests**:
- `src/__tests__/stemma-system/behavioral-contract-validation.test.ts`
- `src/__tests__/stemma-system/form-inputs-contracts.test.ts`
- `src/__tests__/stemma-system/cross-platform-consistency.test.ts`

---

## Integrated Workflow Examples

This section provides concrete examples of combined validation workflows for different development scenarios. Each example shows how linting, unit tests, integration tests, and property tests work together.

### Example 1: New Component Development Workflow

**Scenario**: Creating a new semantic component `Input-Text-Search` that inherits from `Input-Text-Base`.

#### Phase 1: Pre-Development Validation (Linting)

Before writing any code, validate the component design:

```typescript
import { validateComponentName, validatePropertyAndAccessibility } from '../validators';

// Step 1: Validate component name follows Stemma conventions
const nameResult = validateComponentName('Input-Text-Search');
console.log(nameResult);
// ✅ { valid: true, family: 'Input', type: 'Text', variant: 'Search' }

// Step 2: Validate schema structure
const schemaResult = validatePropertyAndAccessibility(
  'Input-Text-Search',
  {
    label: 'Search',
    placeholder: 'Search...',
    value: '',
    // Required properties for Input-Text-Base inheritance
  },
  inputTextSearchSchema
);
// ✅ All required properties present
```

**Checkpoint**: All linting validations pass before proceeding to implementation.

#### Phase 2: Implementation with Real-Time Linting

During development, IDE linting provides immediate feedback:

```typescript
// src/components/core/Input-Text-Search/platforms/web/InputTextSearch.web.ts

import { InputTextBase } from '../../Input-Text-Base';
import { validateTokenUsage } from '../../../../../validators';

export class InputTextSearch extends InputTextBase {
  // IDE linting catches issues immediately:
  
  // ❌ BAD - Linting error: Inline style detected
  // this.style.width = '200px';
  
  // ✅ GOOD - Uses token reference
  // this.classList.add('input-text-search--width-standard');
  
  render() {
    // Token usage validation during development
    const tokenResult = validateTokenUsage(this.outerHTML);
    // Catches any inline styles or hard-coded values
  }
}
```

#### Phase 3: Unit Tests (Runtime Validation)

After implementation, write unit tests for specific behavior:

```typescript
// src/components/core/Input-Text-Search/__tests__/InputTextSearch.test.ts

describe('Input-Text-Search', () => {
  // Test 1: Core functionality
  it('should render search input with correct type', () => {
    const input = createInputTextSearch({ label: 'Search' });
    expect(input.getAttribute('type')).toBe('search');
  });

  // Test 2: Search-specific behavior
  it('should show clear button when value is present', () => {
    const input = createInputTextSearch({ label: 'Search', value: 'test' });
    const clearButton = input.querySelector('.input-text-search__clear');
    expect(clearButton).toBeTruthy();
  });

  // Test 3: Inherited behavior from Input-Text-Base
  it('should apply float label animation', () => {
    const input = createInputTextSearch({ label: 'Search' });
    input.focus();
    expect(input.classList.contains('input-text--label-floated')).toBe(true);
  });

  // Test 4: Accessibility
  it('should have correct ARIA attributes', () => {
    const input = createInputTextSearch({ label: 'Search' });
    expect(input.getAttribute('role')).toBe('searchbox');
    expect(input.getAttribute('aria-label')).toBe('Search');
  });
});
```

#### Phase 4: Integration Tests (Contract Validation)

Test integration with other components:

```typescript
// src/components/core/Input-Text-Search/__tests__/InputTextSearch.integration.test.ts

describe('Input-Text-Search Integration', () => {
  // Test 1: Integration with Icon-Base
  it('should render search icon using Icon-Base', () => {
    const input = createInputTextSearch({ label: 'Search', showIcon: true });
    const iconSpan = input.querySelector('.input-text-search__icon');
    
    // Verify integration contract - Icon-Base CSS class present
    expect(iconSpan!.innerHTML).toContain('icon--size-100');
  });

  // Test 2: Integration with Button-CTA (clear button)
  it('should use Button-CTA for clear action', () => {
    const input = createInputTextSearch({ label: 'Search', value: 'test' });
    const clearButton = input.querySelector('.input-text-search__clear');
    
    // Verify Button-CTA integration
    expect(clearButton!.classList.contains('button-cta')).toBe(true);
  });

  // Test 3: Form integration
  it('should work within form submission', () => {
    const form = document.createElement('form');
    const input = createInputTextSearch({ label: 'Search', name: 'query' });
    form.appendChild(input);
    
    input.value = 'test query';
    const formData = new FormData(form);
    expect(formData.get('query')).toBe('test query');
  });
});
```

#### Phase 5: Property Tests (Universal Properties)

Validate properties that should hold for all inputs:

```typescript
// src/components/core/Input-Text-Search/__tests__/InputTextSearch.property.test.ts

import * as fc from 'fast-check';

describe('Input-Text-Search Properties', () => {
  // Property 1: Label always renders for non-empty strings
  it.prop([fc.string().filter(s => s.trim().length > 0)])(
    'should always render label for non-empty strings',
    (label) => {
      const input = createInputTextSearch({ label });
      const labelElement = input.querySelector('label');
      expect(labelElement?.textContent).toBe(label);
    }
  );

  // Property 2: Value round-trip
  it.prop([fc.string()])(
    'should preserve value through get/set cycle',
    (value) => {
      const input = createInputTextSearch({ label: 'Search' });
      input.value = value;
      expect(input.value).toBe(value);
    }
  );

  // Property 3: Clear button visibility
  it.prop([fc.string().filter(s => s.length > 0)])(
    'should show clear button for any non-empty value',
    (value) => {
      const input = createInputTextSearch({ label: 'Search', value });
      const clearButton = input.querySelector('.input-text-search__clear');
      expect(clearButton).toBeTruthy();
    }
  );
});
```

#### Phase 6: Pre-Merge Validation

Complete validation checklist before merging:

```bash
# 1. Run all linting validators
npm run lint:stemma

# 2. Run unit tests
npm test -- src/components/core/Input-Text-Search/__tests__/InputTextSearch.test.ts

# 3. Run integration tests
npm test -- src/components/core/Input-Text-Search/__tests__/InputTextSearch.integration.test.ts

# 4. Run property tests
npm test -- src/components/core/Input-Text-Search/__tests__/InputTextSearch.property.test.ts

# 5. Run full test suite
npm test
```

---

### Example 2: Component Migration Workflow

**Scenario**: Migrating existing `SearchInput` component to Stemma System naming (`Input-Text-Search`).

#### Phase 1: Pre-Migration Analysis

```typescript
import { validateComponentName } from '../validators';

// Validate old name (expected to fail)
const oldNameResult = validateComponentName('SearchInput');
// ❌ { valid: false, error: 'Missing family prefix' }

// Validate new name
const newNameResult = validateComponentName('Input-Text-Search');
// ✅ { valid: true, family: 'Input', type: 'Text', variant: 'Search' }
```

#### Phase 2: Create Temporary Migration Tests

```typescript
// TEMPORARY TEST - Delete after migration complete
// Retirement Criteria: SearchInput fully migrated to Input-Text-Search

describe('SearchInput Migration (TEMPORARY)', () => {
  it('should have backward compatibility alias', () => {
    // Old import still works during migration
    const { SearchInput } = require('../legacy/SearchInput');
    const { InputTextSearch } = require('../Input-Text-Search');
    
    // Both should produce equivalent output
    const oldInput = new SearchInput({ label: 'Search' });
    const newInput = new InputTextSearch({ label: 'Search' });
    
    expect(oldInput.render()).toEqual(newInput.render());
  });
});
```

#### Phase 3: Update Existing Tests

```typescript
// Before: Tests using old component name
describe('SearchInput', () => {
  it('should render search input', () => {
    const input = createSearchInput({ label: 'Search' });
    // ...
  });
});

// After: Tests using new Stemma System name
describe('Input-Text-Search', () => {
  it('should render search input', () => {
    const input = createInputTextSearch({ label: 'Search' });
    // ...
  });
});
```

#### Phase 4: Validate Migration Complete

```typescript
// Run linting to verify all references updated
import { validateTokenUsage } from '../validators';

// Check no references to old component name remain
const codebaseResult = validateTokenUsage(codebaseContent);
// Should not find 'SearchInput' references
```

#### Phase 5: Delete Temporary Tests

After migration is complete, delete temporary tests with clear commit message:

```
Delete temporary SearchInput migration tests

Retirement criteria met:
- SearchInput fully migrated to Input-Text-Search
- All imports updated to new name
- Backward compatibility period complete

These tests verified migration progress and are no longer needed.
```

---

### Example 3: Integration Contract Update Workflow

**Scenario**: Updating Button-CTA to use new Icon-Base sizing tokens.

#### Phase 1: Validate Contract Change

```typescript
import { validateComponentName, validateTokenUsage } from '../validators';

// Verify both components follow Stemma conventions
validateComponentName('Button-CTA');  // ✅
validateComponentName('Icon-Base');   // ✅

// Document the contract change
// OLD: Button-CTA passes pixel values to Icon
// NEW: Button-CTA passes token references to Icon
```

#### Phase 2: Update Integration Tests

```typescript
// Before: Tests checked pixel values (implementation detail)
it('should render 24px icon for small buttons', () => {
  const button = createButtonCTA({ size: 'small', icon: 'arrow-right' });
  const iconSpan = button.querySelector('.button-cta__icon');
  // ❌ BAD - Tests implementation detail
  expect(iconSpan!.innerHTML).toContain('width="24"');
});

// After: Tests check contract (token-based sizing)
it('should use correct icon size token for small buttons', () => {
  const button = createButtonCTA({ size: 'small', icon: 'arrow-right' });
  const iconSpan = button.querySelector('.button-cta__icon');
  // ✅ GOOD - Tests integration contract
  expect(iconSpan!.innerHTML).toContain('icon--size-100');
});
```

#### Phase 3: Add Contract Property Tests

```typescript
describe('Button-CTA + Icon-Base Contract Properties', () => {
  // Property: Icon size always matches button size variant
  it.prop([fc.constantFrom('small', 'medium', 'large')])(
    'should use correct icon size for button variant',
    (size) => {
      const button = createButtonCTA({ size, icon: 'arrow-right' });
      const iconSpan = button.querySelector('.button-cta__icon');
      
      const expectedClass = size === 'large' ? 'icon--size-200' : 'icon--size-100';
      expect(iconSpan!.innerHTML).toContain(expectedClass);
    }
  );
});
```

#### Phase 4: Validate No Regression

```bash
# Run integration tests
npm test -- src/components/core/Button-CTA/__tests__/ButtonCTA.icon-integration.test.ts

# Run behavioral contract tests
npm test -- src/__tests__/stemma-system/behavioral-contract-validation.test.ts

# Run cross-platform consistency tests
npm test -- src/__tests__/stemma-system/cross-platform-consistency.test.ts
```

---

### Example 4: Cross-Platform Consistency Workflow

**Scenario**: Ensuring Input-Text-Email behaves consistently across web, iOS, and Android.

#### Phase 1: Define Behavioral Contracts

```yaml
# Input-Text-Email.schema.yaml
behavioral_contracts:
  - name: email_validation
    description: Validates email format on blur
    platforms: [web, ios, android]
    
  - name: email_autocomplete
    description: Provides email autocomplete suggestions
    platforms: [web, ios, android]
    
  - name: keyboard_type
    description: Shows email-optimized keyboard
    platforms: [ios, android]
```

#### Phase 2: Write Cross-Platform Contract Tests

```typescript
// src/__tests__/stemma-system/input-text-email-contracts.test.ts

describe('Input-Text-Email Cross-Platform Contracts', () => {
  const platforms = ['web', 'ios', 'android'];
  
  platforms.forEach(platform => {
    describe(`${platform} platform`, () => {
      // Contract 1: Email validation
      it('should validate email format on blur', () => {
        const input = createInputTextEmail({ label: 'Email', platform });
        input.value = 'invalid-email';
        input.blur();
        
        expect(input.validity.valid).toBe(false);
        expect(input.validationMessage).toContain('email');
      });

      // Contract 2: Email autocomplete
      it('should have email autocomplete attribute', () => {
        const input = createInputTextEmail({ label: 'Email', platform });
        expect(input.getAttribute('autocomplete')).toBe('email');
      });
    });
  });

  // Platform-specific tests (acceptable variations)
  describe('Platform-specific behavior', () => {
    it('should show email keyboard on iOS', () => {
      const input = createInputTextEmail({ label: 'Email', platform: 'ios' });
      expect(input.keyboardType).toBe('emailAddress');
    });

    it('should show email keyboard on Android', () => {
      const input = createInputTextEmail({ label: 'Email', platform: 'android' });
      expect(input.inputType).toBe('textEmailAddress');
    });
  });
});
```

#### Phase 3: Validate with Contract Test Reporter

```typescript
import { ContractTestReporter } from '../stemma-system/contract-test-reporter';

const reporter = new ContractTestReporter();

// Run contract validation
const results = reporter.validateContracts('Input-Text-Email', [
  'email_validation',
  'email_autocomplete',
  'keyboard_type'
]);

// Generate report
console.log(reporter.generateReport());
// Output:
// Input-Text-Email Contract Validation
// =====================================
// ✅ email_validation: PASS (web, ios, android)
// ✅ email_autocomplete: PASS (web, ios, android)
// ✅ keyboard_type: PASS (ios, android) - N/A for web
```

---

### Workflow Summary by Task Type

| Task Type | Linting | Unit Tests | Integration Tests | Property Tests | Manual Review |
|-----------|---------|------------|-------------------|----------------|---------------|
| **New Component** | ✅ Pre-dev + During | ✅ Core behavior | ✅ Dependencies | ✅ Universal props | ✅ Accessibility |
| **Component Migration** | ✅ Name validation | ✅ Update existing | ✅ Contract preservation | ⚪ If applicable | ✅ Breaking changes |
| **Contract Update** | ✅ Token usage | ⚪ If behavior changes | ✅ Contract tests | ✅ Contract props | ✅ API changes |
| **Cross-Platform** | ✅ Schema validation | ✅ Platform-specific | ✅ Contract consistency | ✅ Behavioral props | ✅ UX consistency |
| **Bug Fix** | ⚪ If structural | ✅ Regression test | ⚪ If integration | ⚪ If universal | ⚪ If UX impact |

**Legend**: ✅ Required | ⚪ Conditional | ❌ Not needed

---

### Quick Reference: Validation Commands

```bash
# Linting validation
npm run lint:stemma                    # Run all Stemma validators
npm run lint:stemma:naming             # Component naming only
npm run lint:stemma:tokens             # Token usage only

# Unit tests
npm test -- path/to/component.test.ts  # Single test file
npm test -- --testPathPattern=Button   # Pattern matching

# Integration tests
npm test -- --testPathPattern=integration

# Property tests
npm test -- --testPathPattern=property

# Stemma system tests
npm test -- src/__tests__/stemma-system/

# Full validation suite
npm test                               # All tests
npm run test:all                       # Including performance tests
```

---

## Cross-References

### Behavioral Contract Validation Framework
**File**: `.kiro/steering/behavioral-contract-validation-framework.md`

**Related Content**:
- Behavioral contract validation criteria
- Cross-platform consistency validation
- Contract test patterns

**When to Reference**: When writing behavioral contract tests or validating cross-platform consistency.

### Component Development and Practices Guide
**File**: `.kiro/steering/Component Development and Practices Guide.md`

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

