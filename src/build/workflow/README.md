# Build Workflow Module

The workflow module provides development workflow integration for the Cross-Platform Build System, including source map generation, build modes, CI/CD integration, and configuration helpers.

## Source Map Generation

Source maps enable debugging of generated platform-specific code back to original token definitions.

### Features

- **iOS Source Maps**: DWARF debug information for Swift Package builds
- **Android Source Maps**: Kotlin source maps for debugging
- **Web Source Maps**: Standard JavaScript Source Map v3 format
- **Inline/External**: Support for both inline and external source map formats
- **Source Content**: Optional embedding of source content in maps

### Usage

```typescript
import { SourceMapGenerator } from '@designerpunk/build/workflow';

const generator = new SourceMapGenerator();

// Generate source map for Web build
const config = {
  platform: 'web',
  options: {
    enabled: true,
    includeContent: true,
    format: 'external',
  },
  outputPath: '/output/web',
  sourcePaths: ['src/tokens/SpacingTokens.ts', 'src/tokens/ColorTokens.ts'],
};

const result = generator.generateWebSourceMap(config);

if (result.success) {
  console.log(`Source map generated: ${result.sourceMapPath}`);
}
```

### Platform-Specific Generation

#### iOS (Swift)

```typescript
const iosConfig = {
  platform: 'ios',
  options: {
    enabled: true,
    includeContent: true,
    format: 'external', // Generates .dSYM bundle
  },
  outputPath: '/output/ios',
  sourcePaths: ['src/tokens/SpacingTokens.ts'],
};

const result = generator.generateiOSSourceMap(iosConfig);
// Result: /output/ios/DesignTokens.dSYM
```

#### Android (Kotlin)

```typescript
const androidConfig = {
  platform: 'android',
  options: {
    enabled: true,
    includeContent: true,
    format: 'external', // Generates .map file
  },
  outputPath: '/output/android',
  sourcePaths: ['src/tokens/SpacingTokens.ts'],
};

const result = generator.generateAndroidSourceMap(androidConfig);
// Result: /output/android/DesignTokens.map
```

#### Web (TypeScript/JavaScript)

```typescript
const webConfig = {
  platform: 'web',
  options: {
    enabled: true,
    includeContent: true,
    format: 'inline', // Inline base64 source map
  },
  outputPath: '/output/web',
  sourcePaths: ['src/tokens/SpacingTokens.ts'],
};

const result = generator.generateWebSourceMap(webConfig);
// Result: Inline source map in generated code
```

### Multi-Platform Generation

```typescript
const configs = [
  {
    platform: 'ios',
    options: { enabled: true, includeContent: true, format: 'external' },
    outputPath: '/output/ios',
    sourcePaths: ['src/tokens/SpacingTokens.ts'],
  },
  {
    platform: 'android',
    options: { enabled: true, includeContent: true, format: 'external' },
    outputPath: '/output/android',
    sourcePaths: ['src/tokens/SpacingTokens.ts'],
  },
  {
    platform: 'web',
    options: { enabled: true, includeContent: true, format: 'external' },
    outputPath: '/output/web',
    sourcePaths: ['src/tokens/SpacingTokens.ts'],
  },
];

const results = generator.generateSourceMaps(configs);
// Generates source maps for all platforms
```

### Default Options

Get platform-appropriate defaults based on build mode:

```typescript
// Development mode: full source maps with content
const devOptions = generator.getDefaultOptions('web', 'development');
// { enabled: true, includeContent: true, format: 'external' }

// Production mode: minimal source maps
const prodOptions = generator.getDefaultOptions('web', 'production');
// { enabled: true, includeContent: false, format: 'external' }
```

## Source Map Options

### SourceMapOptions

```typescript
interface SourceMapOptions {
  /** Enable source map generation */
  enabled: boolean;
  
  /** Include source content in source map */
  includeContent: boolean;
  
  /** Source map output format */
  format: 'inline' | 'external';
  
  /** Source root path for source map */
  sourceRoot?: string;
}
```

### PlatformSourceMapConfig

```typescript
interface PlatformSourceMapConfig {
  /** Target platform */
  platform: Platform;
  
  /** Source map options */
  options: SourceMapOptions;
  
  /** Output path for source maps */
  outputPath: string;
  
  /** Source file paths to include */
  sourcePaths: string[];
}
```

### SourceMapResult

```typescript
interface SourceMapResult {
  /** Platform for which source map was generated */
  platform: Platform;
  
  /** Path to generated source map file (external format) */
  sourceMapPath?: string;
  
  /** Inline source map content (inline format) */
  inlineSourceMap?: string;
  
  /** Source files included in map */
  sourceFiles: string[];
  
  /** Generation success status */
  success: boolean;
  
  /** Error message if generation failed */
  error?: string;
}
```

## Integration with Build System

Source maps integrate seamlessly with the build orchestrator:

```typescript
import { BuildOrchestrator, SourceMapGenerator } from '@designerpunk/build';

const orchestrator = new BuildOrchestrator();
const sourceMapGenerator = new SourceMapGenerator();

// Configure build with source maps
const buildConfig = {
  platforms: ['ios', 'android', 'web'],
  mode: 'development',
  sourceMaps: true, // Enable source maps
  outputDir: '/output',
};

// Build generates source maps automatically
const results = await orchestrator.build(buildConfig);
```

## Best Practices

### Development Mode

- Enable source maps with full content
- Use external format for better debugging
- Include all source files

```typescript
const devConfig = {
  enabled: true,
  includeContent: true,
  format: 'external',
};
```

### Production Mode

- Enable source maps but exclude content
- Use external format for security
- Consider hosting source maps separately

```typescript
const prodConfig = {
  enabled: true,
  includeContent: false,
  format: 'external',
};
```

### CI/CD Integration

```typescript
// Generate source maps during CI build
const ciConfig = {
  platform: 'web',
  options: {
    enabled: process.env.CI === 'true',
    includeContent: false,
    format: 'external',
  },
  outputPath: process.env.OUTPUT_DIR,
  sourcePaths: getSourceFiles(),
};
```

## Platform-Specific Considerations

### iOS (Swift)

- Uses DWARF debug information format
- Generates `.dSYM` bundle for debugging
- Compatible with Xcode debugger
- Source maps enable breakpoint debugging in original TypeScript

### Android (Kotlin)

- Uses Kotlin source map format
- Generates `.map` file alongside compiled code
- Compatible with Android Studio debugger
- Enables stack trace mapping to original sources

### Web (JavaScript/TypeScript)

- Uses Source Map v3 standard format
- Inline format embeds map in generated code
- External format creates separate `.js.map` file
- Compatible with browser DevTools and error tracking services

## Error Handling

Source map generation handles errors gracefully:

```typescript
const result = generator.generateWebSourceMap(config);

if (!result.success) {
  console.error(`Source map generation failed: ${result.error}`);
  // Continue with build even if source maps fail
}
```

## Future Enhancements

- **Build Mode Support**: Automatic configuration based on development/production mode
- **CI/CD Integration**: Automated source map generation in CI pipelines
- **Config Helpers**: Utilities for common source map configurations
- **Source Map Validation**: Verify source map correctness and completeness

## Related Modules

- **BuildOrchestrator**: Main build coordination
- **Platform Builders**: iOS, Android, Web builders
- **Token Integration**: Token system integration
- **Validation**: Cross-platform validation

## Requirements

Implements requirements from F2 specification:

- **Requirement 8.5**: Source map generation for debugging support
- **Cross-Platform Consistency**: Consistent source map generation across platforms
- **Development Workflow**: Integration with development and production workflows
