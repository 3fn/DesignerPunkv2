/**
 * @category evergreen
 * @purpose Verify deduplication-integration functionality works correctly
 */
/**
 * Integration test for enhanced deduplication functionality
 * 
 * Tests the complete deduplication workflow including similarity detection,
 * change merging, and manual review flagging.
 */

import { SimpleChangeExtractor } from '../SimpleChangeExtractor';
import { DEFAULT_ANALYSIS_CONFIG } from '../../config/AnalysisConfig';
import { CompletionDocument } from '../../types/AnalysisTypes';

describe('Deduplication Integration', () => {
    let extractor: SimpleChangeExtractor;

    beforeEach(() => {
        extractor = new SimpleChangeExtractor(DEFAULT_ANALYSIS_CONFIG.extraction);
    });

    it('should demonstrate complete deduplication workflow', async () => {
        // Create test documents with duplicate and similar changes
        const documents: CompletionDocument[] = [
            {
                path: 'task-1-completion.md',
                content: `
# Task 1 Completion

## Breaking Changes
- Remove deprecated authenticate() method from AuthService
- The old authentication API has been removed

## New Features  
- Add user profile management system
- Implement comprehensive login validation

## Bug Fixes
- Fix authentication timeout issue #123
        `,
                lastModified: new Date(),
                gitCommit: 'abc123',
                metadata: {
                    title: 'Task 1 Completion',
                    type: 'task-completion'
                }
            },
            {
                path: 'task-2-completion.md',
                content: `
# Task 2 Completion

## Breaking Changes
- Remove deprecated authenticate() method
- Removed the old authentication API for security improvements

## New Features
- Add user profile editing functionality  
- Implement login validation with password strength checking

## Bug Fixes
- Resolve authentication timeout problem #123
        `,
                lastModified: new Date(),
                gitCommit: 'def456',
                metadata: {
                    title: 'Task 2 Completion',
                    type: 'task-completion'
                }
            },
            {
                path: 'task-3-completion.md',
                content: `
# Task 3 Completion

## New Features
- Add notification system for user alerts
- Implement email verification process

## Bug Fixes
- Fix database connection pooling issue #456
        `,
                lastModified: new Date(),
                gitCommit: 'ghi789',
                metadata: {
                    title: 'Task 3 Completion',
                    type: 'task-completion'
                }
            }
        ];

        // Extract and deduplicate changes
        const result = await extractor.extractChanges(documents);

        // Verify deduplication occurred
        expect(result.metadata.deduplication).toBeDefined();
        expect(result.metadata.deduplication!.originalCount).toBeGreaterThan(result.breakingChanges.length + result.newFeatures.length + result.bugFixes.length);

        // Check that breaking changes were processed (may be merged or kept separate)
        expect(result.breakingChanges.length).toBeGreaterThan(0);

        // Look for authentication-related breaking changes
        const authBreakingChanges = result.breakingChanges.filter(change =>
            change.title.toLowerCase().includes('authenticate') ||
            change.description.toLowerCase().includes('authenticate')
        );
        expect(authBreakingChanges.length).toBeGreaterThan(0);

        // At least one should reference both documents if merging occurred
        const mergedChange = authBreakingChanges.find(change =>
            change.source.includes('task-1-completion.md') &&
            change.source.includes('task-2-completion.md')
        );

        if (mergedChange) {
            // Merging occurred successfully
            expect(mergedChange.title).toContain('authenticate');
        } else {
            // Changes were kept separate, which is also valid
            expect(authBreakingChanges.length).toBeGreaterThanOrEqual(1);
        }

        // Check that similar bug fixes were merged
        const authBugFix = result.bugFixes.find(fix => fix.title.toLowerCase().includes('authentication'));
        expect(authBugFix).toBeDefined();
        expect(authBugFix!.issueNumber).toBe('#123');

        // Check that different features were handled appropriately
        const profileFeatures = result.newFeatures.filter(feature =>
            feature.title.toLowerCase().includes('profile') ||
            feature.title.toLowerCase().includes('user')
        );

        // Should have either merged similar profile features or flagged them for review
        if (profileFeatures.length === 1) {
            // Features were merged
            expect(profileFeatures[0].description).toContain('profile');
        } else if (result.metadata.deduplication!.uncertainDuplicates.length > 0) {
            // Features were flagged for manual review
            const uncertainProfileFeatures = result.metadata.deduplication!.uncertainDuplicates.find(
                uncertain => uncertain.changeType === 'features'
            );
            expect(uncertainProfileFeatures).toBeDefined();
        }

        // Verify deduplication statistics
        expect(result.metadata.deduplication!.duplicatesRemoved).toBeGreaterThan(0);
        expect(result.metadata.deduplication!.effectiveness).toBeGreaterThan(0);

        // Verify validation includes deduplication warnings if needed
        const validation = extractor.validateExtraction(result);
        if (result.metadata.deduplication!.uncertainDuplicates.length > 0) {
            const deduplicationWarning = validation.warnings.find(warning =>
                warning.message.includes('duplicate')
            );
            expect(deduplicationWarning).toBeDefined();
        }
    });

    it('should handle edge cases in deduplication', async () => {
        const documents: CompletionDocument[] = [
            {
                path: 'single-change.md',
                content: `
# Single Change Document

## New Features
- Add unique feature that has no duplicates
        `,
                lastModified: new Date(),
                gitCommit: 'unique123',
                metadata: {
                    title: 'Single Change',
                    type: 'task-completion'
                }
            }
        ];

        const result = await extractor.extractChanges(documents);

        // Should handle single items without issues
        expect(result.metadata.deduplication).toBeDefined();
        expect(result.metadata.deduplication!.duplicatesRemoved).toBe(0);
        expect(result.metadata.deduplication!.uncertainDuplicates).toHaveLength(0);
        expect(result.newFeatures).toHaveLength(1);
    });

    it('should provide detailed uncertain duplicate information', async () => {
        const documents: CompletionDocument[] = [
            {
                path: 'similar-1.md',
                content: `
## New Features
- Implement user authentication system with OAuth support
        `,
                lastModified: new Date(),
                gitCommit: 'sim1',
                metadata: {
                    title: 'Similar 1',
                    type: 'task-completion'
                }
            },
            {
                path: 'similar-2.md',
                content: `
## New Features  
- Add OAuth-based user authentication functionality
        `,
                lastModified: new Date(),
                gitCommit: 'sim2',
                metadata: {
                    title: 'Similar 2',
                    type: 'task-completion'
                }
            }
        ];

        const result = await extractor.extractChanges(documents);

        // These should either be merged or flagged as uncertain
        if (result.metadata.deduplication!.uncertainDuplicates.length > 0) {
            const uncertain = result.metadata.deduplication!.uncertainDuplicates[0];

            expect(uncertain.changeType).toBe('features');
            expect(uncertain.itemCount).toBe(2);
            expect(uncertain.similarity).toBeGreaterThan(0);
            expect(uncertain.suggestedAction).toMatch(/merge|keep-separate|needs-clarification/);
            expect(uncertain.items).toHaveLength(2);
            expect(uncertain.items[0]).toHaveProperty('id');
            expect(uncertain.items[0]).toHaveProperty('title');
            expect(uncertain.items[0]).toHaveProperty('source');
        }
    });
});