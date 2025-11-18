# Android Drawable Resources

**Date**: November 18, 2025
**Purpose**: Android VectorDrawable resources for Icon component
**Location**: `src/components/core/Icon/platforms/android/res/drawable/`

---

## Directory Structure

This directory contains VectorDrawable XML files for the Icon System. All icons are stored as vector graphics that can scale to any size without quality loss.

```
res/drawable/
├── arrow_down.xml
├── arrow_left.xml
├── arrow_right.xml
├── arrow_up.xml
├── calendar.xml
├── check.xml
├── chevron_right.xml
├── circle.xml
├── heart.xml
├── mail.xml
├── minus.xml
├── plus.xml
├── settings.xml
├── user.xml
└── x.xml
```

---

## Resource Naming Conventions

### Snake Case Format

All Android drawable resources MUST use snake_case naming:

✅ **Correct**:
- `arrow_right.xml`
- `chevron_right.xml`
- `user.xml`

❌ **Incorrect**:
- `arrow-right.xml` (kebab-case)
- `arrowRight.xml` (camelCase)
- `ArrowRight.xml` (PascalCase)

### Naming Rules

1. **Lowercase only**: All characters must be lowercase
2. **Underscores for spaces**: Use underscores to separate words
3. **No hyphens**: Android resource names cannot contain hyphens
4. **Alphanumeric + underscore**: Only letters, numbers, and underscores allowed
5. **Start with letter**: Resource names must start with a letter (not number or underscore)

### Icon Name Mapping

Web/iOS icon names (kebab-case) map to Android resource names (snake_case):

| Web/iOS Name | Android Resource Name |
|--------------|----------------------|
| arrow-right  | arrow_right.xml      |
| arrow-left   | arrow_left.xml       |
| arrow-up     | arrow_up.xml         |
| arrow-down   | arrow_down.xml       |
| chevron-right| chevron_right.xml    |
| check        | check.xml            |
| x            | x.xml                |
| plus         | plus.xml             |
| minus        | minus.xml            |
| circle       | circle.xml           |
| heart        | heart.xml            |
| settings     | settings.xml         |
| user         | user.xml             |
| mail         | mail.xml             |
| calendar     | calendar.xml         |

---

## VectorDrawable Format

All icons use Android VectorDrawable XML format:

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
      android:pathData="[SVG path data]"
      android:strokeWidth="2"
      android:strokeColor="@android:color/white"
      android:strokeLineCap="round"
      android:strokeLineJoin="round"/>
</vector>
```

### Key Attributes

- **android:width/height**: Physical size (24dp standard)
- **android:viewportWidth/Height**: Coordinate system (24x24 grid)
- **android:pathData**: SVG path commands
- **android:strokeWidth**: Line thickness (2dp for Feather Icons)
- **android:strokeColor**: Default color (tinted at runtime)
- **android:strokeLineCap**: Line ending style (round)
- **android:strokeLineJoin**: Corner style (round)

---

## Android Studio Recognition

### Verification Steps

To verify Android Studio recognizes the drawable directory:

1. **Open Android Project**: Open the Android module in Android Studio
2. **Navigate to Resources**: Go to `res/drawable/` in Project view
3. **Check Icon Preview**: Icons should show preview thumbnails
4. **Verify Autocomplete**: Type `R.drawable.` and verify icon names appear
5. **Check Resource Inspection**: Right-click drawable → "Show in Explorer"

### Expected Behavior

✅ **Correct Recognition**:
- Drawable files appear in Project view under `res/drawable/`
- Icon previews render in Android Studio
- Resource IDs available via `R.drawable.[icon_name]`
- No build errors or warnings
- Autocomplete suggests drawable resource names

❌ **Recognition Issues**:
- Files appear as plain XML (no icon preview)
- `R.drawable.[icon_name]` not available
- Build errors about invalid resource names
- Android Studio doesn't index the resources

### Troubleshooting

**Issue**: Drawable directory not recognized

**Solutions**:
1. **Sync Gradle**: File → Sync Project with Gradle Files
2. **Invalidate Caches**: File → Invalidate Caches / Restart
3. **Check Module Structure**: Verify `res/` is marked as resources root
4. **Verify Naming**: Ensure all files use snake_case with .xml extension

**Issue**: Icons don't show previews

**Solutions**:
1. **Check XML Format**: Verify VectorDrawable XML is valid
2. **Update Android Studio**: Ensure using recent version with vector preview support
3. **Check viewBox**: Verify viewportWidth/Height are set correctly

---

## Usage in Icon Component

The Icon component maps icon names to drawable resources:

```kotlin
// Icon.android.kt
private fun getIconResource(name: String): Int {
    return when (name) {
        "arrow-right" -> R.drawable.arrow_right
        "arrow-left" -> R.drawable.arrow_left
        "arrow-up" -> R.drawable.arrow_up
        "arrow-down" -> R.drawable.arrow_down
        "chevron-right" -> R.drawable.chevron_right
        "check" -> R.drawable.check
        "x" -> R.drawable.x
        "plus" -> R.drawable.plus
        "minus" -> R.drawable.minus
        "circle" -> R.drawable.circle
        "heart" -> R.drawable.heart
        "settings" -> R.drawable.settings
        "user" -> R.drawable.user
        "mail" -> R.drawable.mail
        "calendar" -> R.drawable.calendar
        else -> R.drawable.circle // Fallback
    }
}
```

### Name Conversion

The component handles name conversion from kebab-case (web/iOS) to snake_case (Android):

- Input: `"arrow-right"` (kebab-case)
- Resource: `R.drawable.arrow_right` (snake_case)
- File: `arrow_right.xml` (snake_case)

---

## Adding New Icons

When adding new icons to the system:

1. **Convert SVG to VectorDrawable**: Use Android Studio's Vector Asset tool
2. **Name with snake_case**: Follow naming conventions (e.g., `new_icon.xml`)
3. **Place in drawable/**: Save to `res/drawable/` directory
4. **Update Icon Component**: Add mapping in `getIconResource()` function
5. **Update Type Definitions**: Add icon name to `IconName` type in `types.ts`
6. **Verify Recognition**: Check Android Studio recognizes the new resource

---

## Platform-Specific Notes

### Android vs iOS/Web Differences

**Naming Convention**:
- Android: snake_case (arrow_right.xml)
- iOS/Web: kebab-case (arrow-right)

**File Format**:
- Android: VectorDrawable XML
- iOS: PDF/PNG in Asset Catalog
- Web: Optimized SVG

**Color Handling**:
- Android: Tinted via `LocalContentColor.current`
- iOS: Template rendering mode
- Web: `stroke="currentColor"`

### Android-Specific Advantages

- **Vector Graphics**: Scales perfectly to any density (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- **Single File**: One VectorDrawable works for all screen densities
- **Small Size**: XML is compact compared to raster images
- **Runtime Tinting**: Color can be changed without multiple asset versions
- **Build Optimization**: Android build tools optimize VectorDrawables automatically

---

## Validation Checklist

Before considering the drawable structure complete:

- [ ] All 15 icon files present in `res/drawable/`
- [ ] All files use snake_case naming convention
- [ ] All files have .xml extension
- [ ] All files are valid VectorDrawable XML
- [ ] Android Studio recognizes the drawable directory
- [ ] Resource IDs available via `R.drawable.[icon_name]`
- [ ] Icon previews render in Android Studio
- [ ] No build errors or warnings
- [ ] Icon component maps names correctly
- [ ] Documentation complete and accurate

---

*This directory structure follows Android resource conventions and integrates with the Icon System's cross-platform architecture.*
