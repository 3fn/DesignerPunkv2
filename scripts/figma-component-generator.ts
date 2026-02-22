#!/usr/bin/env tsx
/**
 * Figma Component Generator (Exploration Script)
 * 
 * Generates Figma components from DesignerPunk component definitions using
 * Console MCP's figma_execute tool. This is an exploration script to evaluate
 * the feasibility of automated Figma component generation for initial library setup.
 * 
 * Usage:
 *   npm run figma:generate-component
 * 
 * Prerequisites:
 *   - Figma Desktop running with Desktop Bridge plugin active
 *   - FIGMA_FILE_KEY set in .env
 *   - FIGMA_ACCESS_TOKEN set in .env
 *   - DesignerPunk tokens already pushed to Figma (npm run figma:push)
 */

import { ConsoleMCPClientImpl } from '../src/figma/ConsoleMCPClientImpl';
import * as dotenv from 'dotenv';

dotenv.config();

const fileKey = process.env.FIGMA_FILE_KEY;

if (!fileKey) {
  console.error('❌ FIGMA_FILE_KEY not set in .env');
  process.exit(1);
}

/**
 * Generate Plugin API code for Button-CTA component set with all variants
 * 
 * Creates a component set with:
 * - Variants: Primary, Secondary, Tertiary
 * - Sizes: Small, Medium, Large
 * - States: Default (hover/focus/pressed handled by Figma interactions)
 */
function generateButtonCTAComponentSetCode(): string {
  return `
// Find DesignerPunk variables for token bindings (async required)
const variables = await figma.variables.getLocalVariablesAsync();
const collections = await figma.variables.getLocalVariableCollectionsAsync();

// Helper to find variable by path (e.g., "color/primary")
function findVariable(path) {
  return variables.find(v => v.name === path);
}

// Helper to find text style by name
async function findTextStyle(name) {
  const styles = await figma.getLocalTextStylesAsync();
  return styles.find(s => s.name === name);
}

// Helper to find effect style by name
async function findEffectStyle(name) {
  const styles = await figma.getLocalEffectStylesAsync();
  return styles.find(s => s.name === name);
}

// Get primitives collection for mode access
const primitivesCollection = collections.find(c => c.name === "Primitives");
const defaultModeId = primitivesCollection?.modes[0]?.modeId;

// Token references
const tokens = {
  colors: {
    primary: findVariable("color/action/primary"),
    secondary: findVariable("color/action/secondary"),
    onPrimary: findVariable("color/contrast/onPrimary"),
    textDefault: findVariable("color/text/default")
  },
  spacing: {
    paddingSmall: findVariable("semanticSpace/inset/100"),
    paddingMedium: findVariable("semanticSpace/inset/200"),
    paddingLarge: findVariable("semanticSpace/inset/300")
  },
  radius: findVariable("radius/100"),
  shadow: await findEffectStyle("shadow.container"),
  border: findVariable("color/action/secondary") // For secondary button stroke
};

// Text styles
const textStyles = {
  small: await findTextStyle("typography.bodySm"),
  medium: await findTextStyle("typography.bodyMd"),
  large: await findTextStyle("typography.bodyLg")
};

// Variant configurations
const variants = [
  // Primary variants - filled background, white text, shadow
  { variant: "Primary", size: "Small", bg: tokens.colors.primary, text: tokens.colors.onPrimary, padding: tokens.spacing.paddingSmall, textStyle: textStyles.small, stroke: null },
  { variant: "Primary", size: "Medium", bg: tokens.colors.primary, text: tokens.colors.onPrimary, padding: tokens.spacing.paddingMedium, textStyle: textStyles.medium, stroke: null },
  { variant: "Primary", size: "Large", bg: tokens.colors.primary, text: tokens.colors.onPrimary, padding: tokens.spacing.paddingLarge, textStyle: textStyles.large, stroke: null },
  
  // Secondary variants - stroke only, no fill, default text color
  { variant: "Secondary", size: "Small", bg: null, text: tokens.colors.textDefault, padding: tokens.spacing.paddingSmall, textStyle: textStyles.small, stroke: tokens.border },
  { variant: "Secondary", size: "Medium", bg: null, text: tokens.colors.textDefault, padding: tokens.spacing.paddingMedium, textStyle: textStyles.medium, stroke: tokens.border },
  { variant: "Secondary", size: "Large", bg: null, text: tokens.colors.textDefault, padding: tokens.spacing.paddingLarge, textStyle: textStyles.large, stroke: tokens.border },
  
  // Tertiary variants - no background, no stroke, text only
  { variant: "Tertiary", size: "Small", bg: null, text: tokens.colors.textDefault, padding: tokens.spacing.paddingSmall, textStyle: textStyles.small, stroke: null },
  { variant: "Tertiary", size: "Medium", bg: null, text: tokens.colors.textDefault, padding: tokens.spacing.paddingMedium, textStyle: textStyles.medium, stroke: null },
  { variant: "Tertiary", size: "Large", bg: null, text: tokens.colors.textDefault, padding: tokens.spacing.paddingLarge, textStyle: textStyles.large, stroke: null }
];

// Load font once
await figma.loadFontAsync({ family: "Inter", style: "Regular" });

// Create each variant
const createdComponents = [];
for (const config of variants) {
  // Create component
  const component = figma.createComponent();
  component.name = \`Variant=\${config.variant}, Size=\${config.size}\`;
  
  // Set up auto-layout
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  
  // Padding
  if (config.padding && defaultModeId) {
    const paddingValue = config.padding.valuesByMode[defaultModeId];
    if (paddingValue !== undefined) {
      component.paddingLeft = paddingValue;
      component.paddingRight = paddingValue;
      component.paddingTop = paddingValue;
      component.paddingBottom = paddingValue;
    } else {
      // Fallback padding if token value not found
      const fallbackPadding = config.size === "Small" ? 8 : config.size === "Medium" ? 16 : 24;
      component.paddingLeft = fallbackPadding;
      component.paddingRight = fallbackPadding;
      component.paddingTop = fallbackPadding;
      component.paddingBottom = fallbackPadding;
    }
  } else {
    // Fallback if token not found
    const fallbackPadding = config.size === "Small" ? 8 : config.size === "Medium" ? 16 : 24;
    component.paddingLeft = fallbackPadding;
    component.paddingRight = fallbackPadding;
    component.paddingTop = fallbackPadding;
    component.paddingBottom = fallbackPadding;
  }
  
  // Background (only for Primary)
  if (config.bg) {
    component.fills = [{
      type: 'SOLID',
      color: { r: 0.69, g: 0.15, b: 1 }, // Fallback
      boundVariables: {
        color: {
          type: 'VARIABLE_ALIAS',
          id: config.bg.id
        }
      }
    }];
  } else {
    // Secondary and Tertiary have no background
    component.fills = [];
  }
  
  // Stroke (only for Secondary)
  if (config.stroke) {
    component.strokes = [{
      type: 'SOLID',
      color: { r: 0.5, g: 0.5, b: 0.5 }, // Fallback
      boundVariables: {
        color: {
          type: 'VARIABLE_ALIAS',
          id: config.stroke.id
        }
      }
    }];
    component.strokeWeight = 1;
  } else {
    component.strokes = [];
  }
  
  // Corner radius
  if (tokens.radius && defaultModeId) {
    component.cornerRadius = tokens.radius.valuesByMode[defaultModeId];
  }
  
  // Shadow (only for Primary and Secondary)
  if (config.variant !== "Tertiary" && tokens.shadow) {
    await component.setEffectStyleIdAsync(tokens.shadow.id);
  }
  
  // Text label
  const label = figma.createText();
  label.name = "Label";
  label.characters = "Button";
  
  // Text style
  if (config.textStyle) {
    await label.setTextStyleIdAsync(config.textStyle.id);
  }
  
  // Text color
  if (config.text) {
    label.fills = [{
      type: 'SOLID',
      color: { r: 1, g: 1, b: 1 }, // Fallback
      boundVariables: {
        color: {
          type: 'VARIABLE_ALIAS',
          id: config.text.id
        }
      }
    }];
  }
  
  component.appendChild(label);
  createdComponents.push(component);
}

// Combine into component set
const finalComponentSet = figma.combineAsVariants(createdComponents, figma.currentPage);
finalComponentSet.name = "Button-CTA";

// Position on canvas
finalComponentSet.x = 0;
finalComponentSet.y = 0;

return {
  success: true,
  componentSetId: finalComponentSet.id,
  componentSetName: finalComponentSet.name,
  variantsCreated: variants.length,
  variants: variants.map(v => \`\${v.variant} / \${v.size}\`),
  tokenBindings: {
    colors: {
      primary: tokens.colors.primary ? 'bound' : 'NOT FOUND',
      onPrimary: tokens.colors.onPrimary ? 'bound' : 'NOT FOUND',
      textDefault: tokens.colors.textDefault ? 'bound' : 'NOT FOUND'
    },
    spacing: {
      paddingSmall: tokens.spacing.paddingSmall ? 'bound' : 'NOT FOUND',
      paddingMedium: tokens.spacing.paddingMedium ? 'bound' : 'NOT FOUND',
      paddingLarge: tokens.spacing.paddingLarge ? 'bound' : 'NOT FOUND'
    },
    radius: tokens.radius ? 'bound' : 'NOT FOUND',
    shadow: tokens.shadow ? 'bound' : 'NOT FOUND',
    border: tokens.border ? 'bound' : 'NOT FOUND'
  }
};
`;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Figma Component Generator (Exploration)\n');
  console.log('Generating: Button-CTA Component Set');
  console.log('Variants: Primary, Secondary, Tertiary');
  console.log('Sizes: Small, Medium, Large');
  console.log('Total components: 9');
  console.log('File:', fileKey);
  console.log('');

  // Clean up stale ports before connecting
  console.log('🧹 Cleaning up stale MCP processes...');
  const { execSync } = await import('child_process');
  try {
    execSync('lsof -ti:9223-9232 | xargs kill -9 2>/dev/null || true', { stdio: 'ignore' });
  } catch {
    // Ignore errors - ports might not be in use
  }

  const client = new ConsoleMCPClientImpl();
  const pluginCode = generateButtonCTAComponentSetCode();

  try {
    console.log('📡 Connecting to Figma Desktop Bridge...');
    console.log('⏳ Waiting for Desktop Bridge plugin to connect...');
    console.log('   (Open: Plugins → Development → Figma Desktop Bridge)\n');
    
    await client.connect();
    
    // Wait for Desktop Bridge to connect
    // Logs show it can take 4-6 seconds on connection
    console.log('   Waiting 8 seconds for connection to establish...\n');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    console.log('🚀 Executing plugin code...\n');
    
    const result = await client.execute(fileKey!, pluginCode);

    console.log('\n✅ Component set created successfully!\n');
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('\n📋 Next steps:');
    console.log('  1. Open your Figma file to see the generated component set');
    console.log('  2. Evaluate the variants, sizes, and token bindings');
    console.log('  3. Note what needs manual refinement');
    console.log('  4. Test variant switching in Figma');
    console.log('  5. Decide if this approach is useful for other component families');

  } catch (error) {
    console.error('\n❌ Component generation failed:\n');
    console.error(error);
    console.log('\n🔍 Troubleshooting:');
    console.log('  - Ensure Figma Desktop is running');
    console.log('  - Open Desktop Bridge plugin: Plugins → Development → Figma Desktop Bridge');
    console.log('  - Verify tokens are pushed: npm run figma:push');
    console.log('  - Check FIGMA_FILE_KEY matches the open file');
    process.exit(1);
  }
}

main();
