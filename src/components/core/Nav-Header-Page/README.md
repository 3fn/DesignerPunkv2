# Nav-Header-Page

**Family**: Navigation | **Type**: Semantic | **Inherits**: Nav-Header-Base

Opinionated page-level navigation bar for pushed or presented screens. Back/close actions, h1 title, trailing actions, configurable title alignment, and collapsible scroll behavior.

## Usage

```html
<!-- Basic page header with back button -->
<nav-header-page title="Settings">
  <button-icon slot="leading-action" icon="chevron-left" aria-label="Back"></button-icon>
</nav-header-page>

<!-- With trailing actions and close -->
<nav-header-page title="Edit Profile" title-alignment="center">
  <button-icon slot="trailing-actions" icon="share" aria-label="Share"></button-icon>
  <button-icon slot="close-action" icon="close" aria-label="Close"></button-icon>
</nav-header-page>
```

## Key Features

- **Title**: h1 heading, truncates with ellipsis
- **Title alignment**: Platform defaults (iOS: center, Android/Web: leading), configurable
- **Actions**: Button-Icon medium tertiary for all actions
- **Close**: Always at inline-end edge, separated from trailing actions
- **Scroll**: Fixed (default) or collapsible (hide on scroll down, reveal on scroll up)
- **Reduced motion**: Collapsible degrades to fixed
- **Height**: 48px (iOS/Web), 64dp (Android)

## Spec

- Design: `.kiro/specs/088-top-bar-component/design.md`
