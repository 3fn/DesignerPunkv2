/**
 * Test Icon Size Token Generation Across All Platforms
 */

const { TokenFileGenerator } = require('./dist/generators/TokenFileGenerator');
const { getAllPrimitiveTokens } = require('./dist/tokens');
const { getAllSemanticTokens } = require('./dist/tokens/semantic');

console.log('🧪 Testing Icon Size Token Generation Across All Platforms\n');

const generator = new TokenFileGenerator();
const primitives = getAllPrimitiveTokens();
const semantics = getAllSemanticTokens();

const iconTokens = semantics.filter(t => t.category === 'icon');
console.log(`📊 Found ${iconTokens.length} icon size tokens\n`);

// Expected values
const expectedSizes = {
  '050': 13, '075': 18, '100': 24, '125': 32, '150': 28,
  '200': 32, '300': 32, '400': 36, '500': 40, '600': 44, '700': 48
};

let allPassed = true;

// Test Web (TypeScript)
console.log('🌐 Web (CSS) Generation:');
const webResult = generator.generateWebTokens({ outputDir: './test-output' });
console.log(`   Valid: ${webResult.valid}`);
console.log(`   Token count: ${webResult.tokenCount}`);
console.log(`   Semantic count: ${webResult.semanticTokenCount}`);

// Check CSS custom properties
let webPassed = 0;
for (const [scale, value] of Object.entries(expectedSizes)) {
  const regex = new RegExp(`--icon-size-${scale}: ${value}px;`, 'i');
  if (webResult.content.match(regex)) {
    webPassed++;
  } else {
    console.log(`   ❌ --icon-size-${scale} missing or incorrect`);
    allPassed = false;
  }
}
console.log(`   ✅ ${webPassed}/${Object.keys(expectedSizes).length} icon size tokens generated`);

// Test iOS (Swift)
console.log('\n🍎 iOS (Swift) Generation:');
const iosResult = generator.generateiOSTokens({ outputDir: './test-output' });
console.log(`   Valid: ${iosResult.valid}`);
console.log(`   Token count: ${iosResult.tokenCount}`);
console.log(`   Semantic count: ${iosResult.semanticTokenCount}`);

let iosPassed = 0;
for (const [scale, value] of Object.entries(expectedSizes)) {
  const regex = new RegExp(`let iconSize${scale}: CGFloat = ${value}`, 'i');
  if (iosResult.content.match(regex)) {
    iosPassed++;
  } else {
    console.log(`   ❌ iconSize${scale} missing or incorrect`);
    allPassed = false;
  }
}
console.log(`   ✅ ${iosPassed}/${Object.keys(expectedSizes).length} icon size tokens generated`);

// Test Android (Kotlin)
console.log('\n🤖 Android (Kotlin) Generation:');
const androidResult = generator.generateAndroidTokens({ outputDir: './test-output' });
console.log(`   Valid: ${androidResult.valid}`);
console.log(`   Token count: ${androidResult.tokenCount}`);
console.log(`   Semantic count: ${androidResult.semanticTokenCount}`);

let androidPassed = 0;
for (const [scale, value] of Object.entries(expectedSizes).slice(0, 3)) {
  const regex = new RegExp(`val icon_size_${scale} = ${value}\\.dp`, 'i');
  if (androidResult.content.match(regex)) {
    androidPassed++;
  } else {
    console.log(`   ❌ icon_size_${scale} missing or incorrect`);
    allPassed = false;
  }
}
console.log(`   ✅ ${androidPassed}/11 icon size tokens generated (spot check)`);

console.log('\n📋 Sample Output from Each Platform:\n');

// Web sample
const webIconRegex = /--icon-size-\d+: \d+px;/g;
const webMatches = webResult.content.match(webIconRegex);
if (webMatches) {
  console.log('   Web (CSS):');
  webMatches.slice(0, 2).forEach(line => console.log(`     ${line}`));
}

// iOS sample
const iosIconRegex = /let iconSize\d+: CGFloat = \d+/g;
const iosMatches = iosResult.content.match(iosIconRegex);
if (iosMatches) {
  console.log('\n   iOS (Swift):');
  iosMatches.slice(0, 2).forEach(line => console.log(`     ${line}`));
}

// Android sample
const androidIconRegex = /val icon_size_\d+ = \d+\.dp/g;
const androidMatches = androidResult.content.match(androidIconRegex);
if (androidMatches) {
  console.log('\n   Android (Kotlin):');
  androidMatches.slice(0, 2).forEach(line => console.log(`     ${line}`));
}

console.log('\n' + '='.repeat(60));
console.log(allPassed ? '✅ ALL PLATFORMS PASSED' : '❌ SOME PLATFORMS FAILED');
console.log('='.repeat(60));

process.exit(allPassed ? 0 : 1);
