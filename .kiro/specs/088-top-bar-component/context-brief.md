# Spec 088: Top Bar Component — Context Brief

**Date**: 2026-03-29
**Prepared by**: Thurgood
**For**: Lina (design outline author)

---

## Origin

Gap report #0 from Spec 083 (Application MCP Guidance Completeness):

> **Top Bar (Navigation Bar / App Bar)**: Persistent top-of-screen bar with title, optional leading action (back, menu), and optional trailing actions (search, settings, profile). Platform-specific conventions: iOS uses centered title with navigation bar patterns, Android uses top app bar with Material conventions, web varies.

Classification: missing component, universal scope. Every product screen needs one.

## Family Placement

The Navigation family (`Component-Family-Navigation.md`) already lists "Header" as a planned variant alongside Tabs and Breadcrumb. The existing family has:
- Nav-SegmentedChoice-Base (segmented control)
- Nav-TabBar-Base (bottom tab bar)

A top bar would be the third implemented component in the Navigation family.

## Key Design Challenges (from gap report)

1. **True Native composition** — iOS navigation bar, Android top app bar, and web header have significantly different platform conventions. This is the hardest True Native challenge in the catalog.
2. **Safe area handling** — iOS status bar integration, Android system bar, web viewport
3. **Back navigation** — platform-specific patterns (iOS swipe-back, Android system back, web history)
4. **Slot architecture** — leading action, title, trailing actions need flexible composition
5. **Accessibility** — landmark role, heading semantics, back button labeling

## Existing Components It Would Compose With

- Icon-Base (action icons)
- Button-Icon (action buttons)
- Avatar-Base (profile indicator in trailing slot)
- Badge-Count-Base / Badge-Count-Notification (notification indicators on actions)

## References

- Gap report: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md` § "0. Top Bar"
- Resolution tracker: `docs/specs/083-application-mcp-guidance-completeness/gap-report-resolution-tracker.md`
- Navigation family: `.kiro/steering/Component-Family-Navigation.md`
- Navigation guidance: `family-guidance/navigation.yaml`
- Inheritance structures: `.kiro/steering/Component-Inheritance-Structures.md` § "11. Navigation Family"
