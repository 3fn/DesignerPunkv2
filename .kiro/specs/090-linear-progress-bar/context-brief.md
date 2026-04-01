# Spec 090: Linear Progress Bar — Context Brief

**Date**: 2026-03-31
**Prepared by**: Thurgood
**For**: Lina (design outline author)

---

## Origin

Gap report #2 from Spec 083 (Application MCP Guidance Completeness):

> **Linear Progress / Completion Bar**: Percentage-based visual progress indicator for completion tracking. Not a stepper (wrong metaphor for non-sequential completion). Needed for profile completeness, onboarding progress, any completion tracking.

Classification: missing component, universal scope. The ProgressIndicator family has steppers and pagination (sequential/discrete) but no continuous/percentage-based variant.

## Family Placement

The ProgressIndicator family (`Component-Family-Progress.md`) currently has:
- Progress-Indicator-Node-Base (step node)
- Progress-Indicator-Connector-Base (connector between nodes)
- Progress-Indicator-Label-Base (step label)
- Progress-Pagination-Base (dot pagination)
- Progress-Stepper-Base (labeled stepper)
- Progress-Stepper-Detailed (stepper with descriptions)

All existing components model discrete/sequential progress. A linear bar models continuous/percentage progress — a different metaphor but the same family concern (showing progress).

## Key Design Questions

1. **Naming**: `Progress-Bar-Base`? `Progress-Linear-Base`? Should follow Stemma naming conventions.
2. **Props**: `value` (0-1 or 0-100?), `label`, `showPercentage`, `color/variant`?
3. **Indeterminate mode**: Should it support an indeterminate/loading state (animated bar with no percentage)?
4. **Accessibility**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on web. Platform equivalents.
5. **Animation**: Smooth transition when value changes? Motion tokens for duration/easing.
6. **Size variants**: Single size or multiple (sm/md/lg)?

## Existing Components It Would Compose With

- Likely standalone — progress bars are typically self-contained
- Could appear inside Container-Card-Base (stat cards, profile completion cards)
- Could appear in onboarding flows alongside Progress-Stepper-Base

## References

- Gap report: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md` § "2. Linear Progress / Completion Bar"
- Resolution tracker: `docs/specs/083-application-mcp-guidance-completeness/gap-report-resolution-tracker.md`
- Progress family: `.kiro/steering/Component-Family-Progress.md`
- Progress guidance: `family-guidance/progress.yaml`
- Inheritance structures: `.kiro/steering/Component-Inheritance-Structures.md`
