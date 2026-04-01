# Nav-Header-App

**Family**: Navigation | **Type**: Semantic | **Inherits**: Nav-Header-Base | **Readiness**: Scaffold

Permissive app-level header scaffold for root destination screens. Product-defined content in three slots. Inherits safe area, landmark, and background from Nav-Header-Base.

## Intent

Nav-Header-App is the persistent, top-level chrome for a product's primary experience.

- **It orients, it doesn't navigate.** No back button — this is the top level.
- **Its content is product-defined.** The design system provides the structural frame; the product fills it.
- **It inherits the hard problems.** Safe area, landmark semantics, background, tokens — consistent regardless of content.

## Usage

```html
<!-- App-level header with logo and actions -->
<nav-header-app>
  <img slot="leading" src="/logo.svg" alt="App Name" />
  <button-icon slot="trailing" icon="search" aria-label="Search"></button-icon>
  <button-icon slot="trailing" icon="bell" aria-label="Notifications"></button-icon>
</nav-header-app>
```

## Spec

- Design: `.kiro/specs/088-top-bar-component/design.md`
- Intent statement: `.kiro/specs/088-top-bar-component/design-outline.md` § Nav-Header-App Intent
