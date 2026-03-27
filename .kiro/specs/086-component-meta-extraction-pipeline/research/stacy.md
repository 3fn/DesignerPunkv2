# Component Discoverability Research: Stacy

**Agent**: Stacy — Product Governance & Quality Assurance
**Spec**: 086
**Date**: 2026-03-27
**Instructions**: Answer based on your experience auditing product quality, cross-platform parity, and spec structure. Do not read other agents' research docs before completing yours.

---

## Governance & Quality Tasks

For each task, describe how you would verify component usage and what information you'd need.

### Task 1: Audit a product screen for component consistency
You're reviewing a product screen spec to verify it uses the correct DesignerPunk components and follows design system conventions.

**How would you verify which components should be used for each UI element?**

**What information would you need from the component metadata?**

**What's missing from what you currently find?**

---

### Task 2: Check cross-platform parity for a feature
A feature has been implemented on web and iOS. You need to verify the same components are used on both platforms with consistent behavior.

**How would you check which components are available on which platforms?**

**What information would you need to verify parity?**

**What's missing from what you currently find?**

---

### Task 3: Review a spec for component selection correctness
A spec proposes using Container-Base for card-like content sections. You need to assess whether Container-Card-Base would be more appropriate.

**How would you evaluate the component selection?**

**What information would you need to make that assessment?**

**What's missing from what you currently find?**

---

## General Questions

1. When auditing product quality, do you use the Application MCP to look up component information? What queries do you make?

2. Is the `when_to_use` / `when_not_to_use` guidance in component metadata useful for governance decisions? What would make it more useful?

3. Are the `alternatives` fields helpful for identifying when a different component would be more appropriate?

4. Is there anything about the current component metadata that makes governance auditing harder than it should be?

5. What would make your component governance workflow faster or more reliable?

6. What does the Application MCP tell you that's different from what you already know about auditing design system usage and product quality?

7. What's an example of something you understood before accessing the Application MCP that changed after accessing it? What's an example of something that stayed the same?
