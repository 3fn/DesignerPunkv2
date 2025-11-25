# Task 7.1-Prototype Plan: Executable Examples Pattern

**Date**: November 24, 2025
**Purpose**: Document the prototype approach for component example documentation
**Organization**: spec-completion
**Scope**: 005-cta-button-component
**Status**: Planning

---

## Context

During Task 7.1 execution, we identified a fundamental tension in component documentation:

**The Core Dilemma**:
- **Static HTML examples in comments** → Contamination vectors (become stale, mislead AI agents)
- **Tests as documentation** → Test suite bloat (adds execution time, maintenance burden)
- **Neither solution is ideal** → Need a third option

**The Audit Context**:
From `.kiro/audits/FUTURE-test-suite-volume-analysis.md`:
- Already at 3,949 tests (~16 seconds execution)
- Over-testing infrastructure (1,500+ tests for release detection alone)
- Adding "documentation tests" for every component would compound the problem

---

## The Proposed Solution: Executable Examples

Create a separate `examples/` directory with runnable code that **isn't part of the test suite**:

```
src/components/core/ButtonCTA/
  examples/
    BasicUsage.html          # Vanilla web component examples
    WithIcon.html            # Button with icon
    Variants.html            # Size and style variants
  __tests__/
    ButtonCTA.test.ts        # Actual tests (keep minimal)
  platforms/
    web/
      ButtonCTA.web.tsx
```

**Key Characteristics**:
- **Executable**: Can be opened in browser or run with `npm run examples`
- **Not tests**: Don't run on `npm test` (zero execution cost)
- **Validated on demand**: Run `npm run validate:examples` manually or in CI
- **Living documentation**: Break when component API changes (self-correcting)
- **Zero test suite impact**: Examples don't add to main test execution time

---

## Why This Could Work

### For AI Agents
- Examples are real code (not comments that can become stale)
- Examples break when API changes (self-correcting, not contamination vectors)
- Examples are in dedicated files (clear source of truth)

### For Test Suite Volume
- Examples don't run on `npm test` (zero execution cost)
- Validation runs only when needed (CI or manual)
- Test suite stays focused on correctness, not documentation

### For Maintenance
- Examples update when component changes (or they break)
- Validation catches broken examples before merge
- No duplication between tests and examples

---

## Prototype Scope (Task 7.1-Prototype)

### What to Build

**Minimal Implementation**:
1. Create `src/components/core/ButtonCTA/examples/` directory
2. Create 3 minimal HTML examples:
   - `BasicUsage.html` - Default button, custom label, onPress handler, disabled
   - `WithIcon.html` - Button with icon integration
   - `Variants.html` - Size and style variants
3. Create simple validation script (`scripts/validate-examples.js`):
   - Just check files exist and have `<button-cta>` element
   - Basic HTML validation (no headless browser yet)
   - ~50 lines or less
4. Manually test examples in browser
5. Document findings in completion notes

**What NOT to Include** (keep it minimal):
- ❌ Headless browser testing (too complex for prototype)
- ❌ CI integration (premature)
- ❌ Multiple components (just ButtonCTA)
- ❌ Comprehensive validation (keep it simple)

### Success Criteria

The pattern succeeds if:
1. **Examples are clearer** than static comments would be
2. **Examples break** when component API changes (self-correcting)
3. **Validation script is maintainable** (~50 lines or less)
4. **Manual testing feels reasonable** (< 5 minutes)

The pattern fails if:
1. Examples feel like busywork
2. Validation is too complex
3. Maintenance burden feels heavy
4. Static comments would have been simpler

---

## Resolution Process (Task 7.1-Resolution)

### Evaluation Framework

After completing the prototype, evaluate against these questions:

**1. Clarity**
- Are examples easier to understand than static comments?
- Do examples provide better context than README-only docs?
- Can AI agents discover and use examples effectively?

**2. Self-Correction**
- Do examples break when component API changes?
- Is breakage obvious (TypeScript/linting catches it)?
- Is fixing broken examples straightforward?

**3. Maintainability**
- Is the validation script simple enough to maintain?
- Does the examples/ directory feel organized or cluttered?
- Is the maintenance burden acceptable?

**4. Test Suite Impact**
- Do examples truly have zero test execution cost?
- Is validation-on-demand practical?
- Does this solve the test suite volume concern?

### Decision Options

**Option 1: Adopt Executable Examples**
- Update Tasks 7.2-7.5 to use examples/ pattern
- Document pattern in Component Development Guide
- Apply to future components
- **When to choose**: If prototype shows clear value and manageable complexity

**Option 2: Use Tests as Documentation**
- Reference __tests__/ files for usage examples
- No separate examples/ directory
- Accept test suite growth as necessary cost
- **When to choose**: If executable examples feel like over-engineering

**Option 3: Use Minimal Static Examples**
- README-only documentation
- Add "may be stale" warnings
- Keep it simple, accept staleness risk
- **When to choose**: If both other options feel too complex

### Decision Documentation

Create `.kiro/specs/005-cta-button-component/task-7-1-resolution.md` with:

**If Adopting**:
- What worked well
- Recommended adjustments
- How to apply to remaining tasks (7.2-7.5)
- Pattern documentation for Component Development Guide

**If Rejecting**:
- What didn't work
- Why alternative is better
- Alternative approach recommendation
- Lessons learned for future components

**Either Way**:
- Evidence-based reasoning
- Specific examples from prototype
- Clear decision rationale
- Update design.md Documentation Strategy section

---

## Implementation Pattern (If Adopted)

### Example File Format

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ButtonCTA - Basic Usage</title>
  <script type="module" src="../platforms/web/ButtonCTA.web.js"></script>
</head>
<body>
  <h1>ButtonCTA - Basic Usage</h1>
  
  <!-- Example 1: Default Button -->
  <section>
    <h2>Default Button</h2>
    <button-cta label="Click me"></button-cta>
  </section>
  
  <!-- Example 2: Custom Label -->
  <section>
    <h2>Custom Label</h2>
    <button-cta label="Submit Form"></button-cta>
  </section>
  
  <!-- Example 3: With Event Handler -->
  <section>
    <h2>With Event Handler</h2>
    <button-cta id="handler-example" label="Click for Alert"></button-cta>
    <script>
      document.getElementById('handler-example')
        .addEventListener('press', () => alert('Button pressed!'));
    </script>
  </section>
  
  <!-- Example 4: Disabled -->
  <section>
    <h2>Disabled Button</h2>
    <button-cta label="Disabled" disabled></button-cta>
  </section>
</body>
</html>
```

### Validation Script Format

```javascript
// scripts/validate-examples.js
const fs = require('fs');
const path = require('path');

// Just check that examples exist and have valid HTML
const examplesDir = 'src/components/core/ButtonCTA/examples';
const examples = fs.readdirSync(examplesDir);

examples.forEach(file => {
  const content = fs.readFileSync(path.join(examplesDir, file), 'utf8');
  
  // Basic checks
  if (!content.includes('<button-cta')) {
    console.error(`${file}: Missing <button-cta> element`);
    process.exit(1);
  }
  
  console.log(`✓ ${file}: Valid`);
});

console.log(`\n✅ All ${examples.length} examples validated`);
```

### Package.json Scripts (If Adopted)

```json
{
  "scripts": {
    "test": "jest",
    "examples": "serve src/components/core/ButtonCTA/examples",
    "validate:examples": "node scripts/validate-examples.js"
  }
}
```

---

## Counter-Arguments (Systematic Skepticism)

### Argument: "Examples can still become stale if we don't run them"

**Response**: True, but:
- They break when component API changes (TypeScript/linting catches this)
- CI runs validation on component changes (catches breakage before merge)
- Manual validation is fast (~10-15 seconds) and only needed occasionally
- Staleness risk is much lower than static comments

### Argument: "This is just moving the problem - now we have examples to maintain"

**Response**: Yes, but:
- Examples are intentional documentation (not accidental like comments)
- Examples have clear ownership (part of component development)
- Examples have validation (unlike comments)
- Examples are optional (can be skipped for simple components)

### Argument: "Won't this create more files and complexity?"

**Response**: Yes, but:
- Complexity is explicit (examples/ directory) not hidden (comments)
- Files are discoverable (clear structure) not scattered (comments everywhere)
- Maintenance is intentional (update examples) not accidental (forget to update comments)

### Argument: "Validation script complexity could grow"

**Response**: True, and this is a key evaluation point:
- Start simple (just check files exist and have `<button-cta>`)
- Add headless browser testing only if needed
- If validation becomes complex, that's evidence to reject the pattern
- Prototype will reveal if this is a real concern

---

## Meta-Insight

This conversation reveals a fundamental tension in AI-safe documentation:

- **Static documentation** → Contamination vectors (become stale, mislead AI)
- **Test-based documentation** → Unsustainable growth (execution time compounds)
- **Executable examples** → Living documentation without test suite bloat

This is a design pattern for sustainable AI-safe documentation that could be captured in the AI collaboration framework if successful.

---

## References

- **Transcript**: `.kiro/specs/005-cta-button-component/temp-exampleDocDecision.md`
- **Test Suite Audit**: `.kiro/audits/FUTURE-test-suite-volume-analysis.md`
- **Design Doc**: `.kiro/specs/005-cta-button-component/design.md` (Documentation Strategy section)
- **Component Development Guide**: `.kiro/steering/Component Development Guide.md`

---

*This plan provides the framework for prototyping and evaluating the executable examples pattern before committing to it across all components.*
