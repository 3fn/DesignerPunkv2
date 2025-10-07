/**
 * Android Builder - Kotlin Token Generation Tests
 * Tests for task 4.2: Kotlin token generation
 */

import { AndroidBuilder } from '../AndroidBuilder';
import { PlatformTokens } from '../../tokens/PlatformTokens';

describe('AndroidBuilder - Kotlin Token Generation', () => {
    let builder: AndroidBuilder;

    beforeEach(() => {
        builder = new AndroidBuilder();
    });

    it('should generate Kotlin constants with dp units for spacing', () => {
        const tokens: PlatformTokens = {
            platform: 'android',
            primitives: {
                spacing: { space100: { value: 8, unit: 'dp', token: 'space100' } },
                colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            semantics: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            components: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            metadata: {
                platform: 'android', defaultSpacingUnit: 'dp', defaultTypographyUnit: 'sp',
                supportedUnits: ['dp', 'sp'],
                constraints: { decimalPrecision: 2, supportsSubpixel: false, roundingMode: 'round' },
                generatedAt: new Date()
            }
        };

        const result = builder.generateTokens(tokens);

        expect(result).toContain('val space100: Dp = 8.dp');
        expect(result).toContain('import androidx.compose.ui.unit.dp');
    });

    it('should generate Kotlin constants with sp units for typography', () => {
        const tokens: PlatformTokens = {
            platform: 'android',
            primitives: {
                spacing: {}, colors: {},
                typography: { fontSize100: { value: 16, unit: 'sp', token: 'fontSize100' } },
                radius: {}, sizing: {}, opacity: {}, elevation: {}, animation: {}
            },
            semantics: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            components: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            metadata: {
                platform: 'android', defaultSpacingUnit: 'dp', defaultTypographyUnit: 'sp',
                supportedUnits: ['dp', 'sp'],
                constraints: { decimalPrecision: 2, supportsSubpixel: false, roundingMode: 'round' },
                generatedAt: new Date()
            }
        };

        const result = builder.generateTokens(tokens);

        expect(result).toContain('val fontSize100: TextUnit = 16.sp');
        expect(result).toContain('import androidx.compose.ui.unit.sp');
    });

    it('should generate Kotlin Color constants from hex values', () => {
        const tokens: PlatformTokens = {
            platform: 'android',
            primitives: {
                spacing: {},
                colors: { 'color.blue.500': { value: '#3B82F6', unit: '', token: 'color.blue.500' } },
                typography: {}, radius: {}, sizing: {}, opacity: {}, elevation: {}, animation: {}
            },
            semantics: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            components: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            metadata: {
                platform: 'android', defaultSpacingUnit: 'dp', defaultTypographyUnit: 'sp',
                supportedUnits: ['dp', 'sp'],
                constraints: { decimalPrecision: 2, supportsSubpixel: false, roundingMode: 'round' },
                generatedAt: new Date()
            }
        };

        const result = builder.generateTokens(tokens);

        expect(result).toContain('val colorBlue500 = Color(0xFF3B82F6)');
        expect(result).toContain('import androidx.compose.ui.graphics.Color');
    });

    it('should convert token names to proper camelCase', () => {
        const tokens: PlatformTokens = {
            platform: 'android',
            primitives: {
                spacing: {
                    'space.extra.large': { value: 32, unit: 'dp', token: 'space.extra.large' }
                },
                colors: {},
                typography: {
                    'font-size-heading': { value: 24, unit: 'sp', token: 'font-size-heading' }
                },
                radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            semantics: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            components: {
                spacing: {}, colors: {}, typography: {}, radius: {}, sizing: {},
                opacity: {}, elevation: {}, animation: {}
            },
            metadata: {
                platform: 'android', defaultSpacingUnit: 'dp', defaultTypographyUnit: 'sp',
                supportedUnits: ['dp', 'sp'],
                constraints: { decimalPrecision: 2, supportsSubpixel: false, roundingMode: 'round' },
                generatedAt: new Date()
            }
        };

        const result = builder.generateTokens(tokens);

        // Verify proper camelCase conversion
        expect(result).toContain('val spaceExtraLarge: Dp = 32.dp');
        expect(result).toContain('val fontSizeHeading: TextUnit = 24.sp');
    });
});
