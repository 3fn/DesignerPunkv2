# Nav-BottomTabs-Base Component - Design Outline

**Date**: January 19, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

> ⚠️ **PLACEHOLDER NOTICE**: The visual specifications, token references, and pixel values in this document are preliminary placeholders largely derived from the wrkingClass prototype. They are NOT yet aligned with DesignerPunk's token system and design language. This outline must be reviewed and updated to use proper DesignerPunk tokens before proceeding to requirements.md.

---

## Component Overview

BottomTabs is a primary navigation component that provides persistent access to top-level destinations in an app. It appears at the bottom of the screen and allows users to switch between major sections with a single tap.

**Key Characteristics**:
- **Primary navigation**: Top-level app destinations
- **Persistent**: Always visible during navigation
- **Icon + label**: Visual and text identification
- **Badge support**: Notification indicators
- **Platform-agnostic**: Unified API across web/iOS/Android

**Platform Equivalents**:
- iOS: `UITabBar` / `TabView`
- Android: `BottomNavigationView` / `NavigationBar`
- Web: Custom bottom navigation

---

## Architecture

### Component Structure

```
Nav-BottomTabs-Base (Primitive)
├── Provides foundational bottom tab navigation
├── Tab items, selected state, badges
└── Semantic variants inherit from this

Future Semantic Variants:
├── Nav-BottomTabs-Floating (elevated floating bar)
├── Nav-BottomTabs-Minimal (icon-only, labels on selection)
└── Nav-BottomTabs-Adaptive (responds to screen size)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

---

## Visual Specifications

### Container

| Property | Value |
|----------|-------|
| Background | `color.surface.primary` |
| Border Top | 1px `color.border.subtle` |
| Height | 56px (content) + safe area inset |
| Position | Fixed to bottom |
| Shadow | `shadow.sm` (optional, for elevation) |

### Tab Item States

| State | Icon Color | Label Color | Description |
|-------|------------|-------------|-------------|
| **unselected** | `color.content.tertiary` | `color.content.tertiary` | Default state |
| **selected** | `color.interactive.primary` | `color.interactive.primary` | Active tab |
| **pressed** | `color.interactive.primaryPressed` | `color.interactive.primaryPressed` | Touch feedback |
| **disabled** | `color.content.disabled` | `color.content.disabled` | Unavailable |

### Tab Item Layout

| Property | Value |
|----------|-------|
| Icon Size | `icon.size200` (24px) |
| Label Font | `fontSize.xs` (12px) |
| Label Weight | `fontWeight.medium` |
| Icon-Label Gap | `space050` (4px) |
| Min Width | 64px |
| Max Width | 168px |

### Badge

| Property | Value |
|----------|-------|
| Position | Top-right of icon |
| Background | `color.feedback.error.emphasis` |
| Text Color | `white100` |
| Min Size | 16px (dot) / 18px (with count) |
| Font Size | `fontSize.xxs` (10px) |
| Max Count Display | "99+" |

---

## Token Requirements

### New Semantic Tokens

```typescript
// BottomTabs-specific semantic tokens
'bottomTabs.container.background': {
  primitiveReferences: { value: 'color.surface.primary' },
  context: 'Tab bar background',
  description: 'Background color of the bottom tab bar'
},

'bottomTabs.container.border': {
  primitiveReferences: { value: 'color.border.subtle' },
  context: 'Tab bar border',
  description: 'Top border color of the tab bar'
},

'bottomTabs.tab.icon.selected': {
  primitiveReferences: { value: 'color.interactive.primary' },
  context: 'Selected tab icon',
  description: 'Icon color for selected tab'
},

'bottomTabs.tab.icon.unselected': {
  primitiveReferences: { value: 'color.content.tertiary' },
  context: 'Unselected tab icon',
  description: 'Icon color for unselected tabs'
},

'bottomTabs.tab.label.selected': {
  primitiveReferences: { value: 'color.interactive.primary' },
  context: 'Selected tab label',
  description: 'Label color for selected tab'
},

'bottomTabs.tab.label.unselected': {
  primitiveReferences: { value: 'color.content.tertiary' },
  context: 'Unselected tab label',
  description: 'Label color for unselected tabs'
},

'bottomTabs.badge.background': {
  primitiveReferences: { value: 'color.feedback.error.emphasis' },
  context: 'Badge background',
  description: 'Background color for notification badges'
},

// Size tokens
'bottomTabs.height': { value: 56 },
'bottomTabs.tab.minWidth': { value: 64 },
'bottomTabs.tab.maxWidth': { value: 168 }
```

### Existing Tokens Used

**Colors**:
- `color.surface.primary` (container)
- `color.border.subtle` (top border)
- `color.interactive.primary`, `color.interactive.primaryPressed`
- `color.content.tertiary`, `color.content.disabled`
- `color.feedback.error.emphasis` (badge)
- `white100` (badge text)

**Typography**:
- `fontSize.xs` (12px - labels)
- `fontSize.xxs` (10px - badge count)
- `fontWeight.medium`

**Spacing**:
- `space050` (icon-label gap)

**Icons**:
- `icon.size200` (24px)

**Shadow**:
- `shadow.sm` (optional elevation)

**Motion**:
- `motion.duration.fast` (selection transition)

---

## Component API Design

### Props Interface

```typescript
interface BottomTabsProps {
  /** Array of tab items */
  tabs: TabItem[];
  
  /** Currently selected tab value */
  selectedValue: string;
  
  /** Called when tab selection changes */
  onTabChange: (value: string) => void;
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Test ID for automated testing */
  testID?: string;
}

interface TabItem {
  /** Unique value for this tab */
  value: string;
  
  /** Display label */
  label: string;
  
  /** Icon component or icon name */
  icon: IconType;
  
  /** Optional badge count (0 = dot, >0 = count) */
  badge?: number;
  
  /** Whether this tab is disabled */
  disabled?: boolean;
}
```

### Default Values

```typescript
const defaults = {
  showLabels: true
};
```

### Usage Examples

```tsx
// Basic bottom tabs (wrkingClass style)
<BottomTabs
  tabs={[
    { value: 'home', label: 'Home', icon: HomeIcon },
    { value: 'legislation', label: 'Legislation', icon: FileTextIcon },
    { value: 'representatives', label: 'Reps', icon: UsersIcon },
    { value: 'donate', label: 'Donate', icon: HeartIcon }
  ]}
  selectedValue={currentTab}
  onTabChange={setCurrentTab}
/>

// With badges
<BottomTabs
  tabs={[
    { value: 'home', label: 'Home', icon: HomeIcon },
    { value: 'notifications', label: 'Alerts', icon: BellIcon, badge: 3 },
    { value: 'messages', label: 'Messages', icon: MessageIcon, badge: 12 },
    { value: 'profile', label: 'Profile', icon: UserIcon }
  ]}
  selectedValue={currentTab}
  onTabChange={setCurrentTab}
/>

// With dot badge (no count)
<BottomTabs
  tabs={[
    { value: 'feed', label: 'Feed', icon: HomeIcon },
    { value: 'activity', label: 'Activity', icon: ActivityIcon, badge: 0 }
  ]}
  selectedValue={currentTab}
  onTabChange={setCurrentTab}
/>

// Icon-only (no labels)
<BottomTabs
  tabs={[...]}
  selectedValue={currentTab}
  onTabChange={setCurrentTab}
  showLabels={false}
/>
```

---

## Platform Considerations

### Web Implementation

```html
<nav class="bottom-tabs" role="tablist">
  <button 
    class="bottom-tabs__tab bottom-tabs__tab--selected"
    role="tab"
    aria-selected="true"
  >
    <span class="bottom-tabs__icon">
      <svg><!-- icon --></svg>
      <span class="bottom-tabs__badge">3</span>
    </span>
    <span class="bottom-tabs__label">Home</span>
  </button>
  <!-- more tabs -->
</nav>
```

```css
.bottom-tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-tabs-height);
  background-color: var(--bottom-tabs-container-background);
  border-top: 1px solid var(--bottom-tabs-container-border);
  display: flex;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-tabs__tab {
  flex: 1;
  max-width: var(--bottom-tabs-tab-max-width);
  min-width: var(--bottom-tabs-tab-min-width);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-050);
  background: transparent;
  border: none;
  cursor: pointer;
}

.bottom-tabs__icon {
  position: relative;
  color: var(--bottom-tabs-tab-icon-unselected);
}

.bottom-tabs__tab--selected .bottom-tabs__icon {
  color: var(--bottom-tabs-tab-icon-selected);
}

.bottom-tabs__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--bottom-tabs-tab-label-unselected);
}

.bottom-tabs__tab--selected .bottom-tabs__label {
  color: var(--bottom-tabs-tab-label-selected);
}

.bottom-tabs__badge {
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  background-color: var(--bottom-tabs-badge-background);
  color: white;
  font-size: var(--font-size-xxs);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
```

### iOS Implementation

```swift
struct BottomTabs: View {
    let tabs: [TabItem]
    @Binding var selectedValue: String
    let showLabels: Bool
    
    var body: some View {
        HStack {
            ForEach(tabs, id: \.value) { tab in
                Button(action: { selectedValue = tab.value }) {
                    VStack(spacing: Tokens.space050) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: tab.icon)
                                .font(.system(size: 24))
                                .foregroundColor(selectedValue == tab.value 
                                    ? Tokens.bottomTabsTabIconSelected 
                                    : Tokens.bottomTabsTabIconUnselected)
                            
                            if let badge = tab.badge {
                                BadgeView(count: badge)
                                    .offset(x: 8, y: -4)
                            }
                        }
                        
                        if showLabels {
                            Text(tab.label)
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(selectedValue == tab.value 
                                    ? Tokens.bottomTabsTabLabelSelected 
                                    : Tokens.bottomTabsTabLabelUnselected)
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
                .disabled(tab.disabled)
            }
        }
        .frame(height: 56)
        .padding(.bottom, safeAreaInsets.bottom)
        .background(Tokens.bottomTabsContainerBackground)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Tokens.bottomTabsContainerBorder),
            alignment: .top
        )
    }
}
```

### Android Implementation

```kotlin
@Composable
fun BottomTabs(
    tabs: List<TabItem>,
    selectedValue: String,
    onTabChange: (String) -> Unit,
    showLabels: Boolean = true
) {
    NavigationBar(
        containerColor = DesignTokens.bottomTabsContainerBackground,
        modifier = Modifier.height(56.dp)
    ) {
        tabs.forEach { tab ->
            val isSelected = tab.value == selectedValue
            
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabChange(tab.value) },
                icon = {
                    BadgedBox(
                        badge = {
                            tab.badge?.let { count ->
                                Badge(
                                    containerColor = DesignTokens.bottomTabsBadgeBackground
                                ) {
                                    if (count > 0) {
                                        Text(
                                            if (count > 99) "99+" else count.toString(),
                                            fontSize = 10.sp
                                        )
                                    }
                                }
                            }
                        }
                    ) {
                        Icon(
                            tab.icon,
                            contentDescription = tab.label,
                            tint = if (isSelected) 
                                DesignTokens.bottomTabsTabIconSelected
                            else 
                                DesignTokens.bottomTabsTabIconUnselected
                        )
                    }
                },
                label = if (showLabels) {
                    {
                        Text(
                            tab.label,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = if (isSelected)
                                DesignTokens.bottomTabsTabLabelSelected
                            else
                                DesignTokens.bottomTabsTabLabelUnselected
                        )
                    }
                } else null,
                enabled = !tab.disabled
            )
        }
    }
}
```

**Platform Notes**:
- **Web**: Fixed positioning with safe area padding for notched devices
- **iOS**: Respects safe area insets automatically
- **Android**: Uses Material 3 `NavigationBar` as base, customized with tokens

---

## Accessibility

### Screen Readers
- Container announced as tab list
- Each tab announced with label and selected state
- Badge count announced (e.g., "3 notifications")

### Keyboard Navigation (Web)
- Tab to focus the navigation
- Arrow keys to navigate between tabs
- Enter/Space to select focused tab
- Focus ring visible on keyboard focus

### Touch Targets
- Minimum 44px touch target height
- Full width of tab item is tappable

### Reduced Motion
- Selection transitions respect `prefers-reduced-motion`

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Icon + label default | Better discoverability than icon-only |
| 2 | 56px height | Standard across platforms |
| 3 | Platform-agnostic name | "BottomTabs" works across platforms |
| 4 | Badge support built-in | Common pattern for notifications |
| 5 | Safe area handling | Essential for modern devices |
| 6 | 3-5 tabs recommended | UX best practice |

---

## Future Enhancements (Separate Specs)

1. **Nav-BottomTabs-Floating**: Elevated floating bar with rounded corners
2. **Nav-BottomTabs-Minimal**: Icon-only, labels appear on selection
3. **Nav-BottomTabs-Adaptive**: Converts to side rail on larger screens

---

## Next Steps

1. ✅ **Design outline created** - Decisions documented
2. ⏳ **Review with Peter** - Validate decisions
3. ⏳ **Create requirements.md** - EARS format
4. ⏳ **Create design.md** - Detailed architecture
5. ⏳ **Create tasks.md** - Implementation plan

---

**Organization**: spec-guide
**Scope**: 050-nav-bottomtabs-base
