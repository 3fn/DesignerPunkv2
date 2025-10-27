"use strict";
/**
 * Tests for Change Categorization System
 *
 * Validates the sophisticated classification logic for different change types,
 * severity assessment, and benefit extraction functionality.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ChangeCategorizationSystem_1 = require("../ChangeCategorizationSystem");
const AnalysisConfig_1 = require("../../config/AnalysisConfig");
describe('ChangeCategorizationSystem', () => {
    let categorizationSystem;
    beforeEach(() => {
        categorizationSystem = new ChangeCategorizationSystem_1.ChangeCategorizationSystem(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.extraction);
    });
    describe('categorizeChange', () => {
        it('should identify breaking changes correctly', () => {
            const result = categorizationSystem.categorizeChange('Remove deprecated API method', 'This change removes the old getUserData() method that was deprecated in v2.0. Migration required to use the new getUserInfo() method.', 'API interface change');
            expect(result.type).toBe('breaking');
            expect(result.confidence).toBeGreaterThan(0.5);
            expect(result.reasoning).toContain('Migration required');
        });
        it('should identify new features correctly', () => {
            const result = categorizationSystem.categorizeChange('Add new user authentication system', 'Implements new OAuth2 authentication feature that allows users to login with third-party providers. Enhances security and user experience.', 'New functionality added');
            expect(result.type).toBe('feature');
            expect(result.confidence).toBeGreaterThan(0.5);
            expect(result.reasoning).toContain('Enhancement');
        });
        it('should identify bug fixes correctly', () => {
            const result = categorizationSystem.categorizeChange('Fix memory leak in data processing', 'Resolves issue #123 where the data processor was not properly releasing memory after processing large datasets. Prevents application crashes.', 'Bug fix for critical issue');
            expect(result.type).toBe('bugfix');
            expect(result.confidence).toBeGreaterThan(0.5);
            expect(result.reasoning).toContain('Issue resolution');
        });
        it('should identify improvements correctly', () => {
            const result = categorizationSystem.categorizeChange('Optimize database query performance', 'Improves performance of user lookup queries by 50% through better indexing and query optimization. Reduces response time significantly.', 'Performance optimization');
            expect(result.type).toBe('improvement');
            expect(result.confidence).toBeGreaterThan(0.5);
            expect(result.reasoning).toContain('Performance improvement');
        });
        it('should handle ambiguous changes', () => {
            const result = categorizationSystem.categorizeChange('Update component styling', 'Changes the appearance of buttons to match new design guidelines.', 'Visual update');
            expect(result.confidence).toBeLessThan(0.8);
            expect(result.suggestedCategory).toBeDefined();
        });
    });
    describe('assessBreakingChangeSeverity', () => {
        it('should assess critical severity correctly', () => {
            const result = categorizationSystem.assessBreakingChangeSeverity('Remove core authentication API', 'This change removes the entire authentication system API, causing data loss for existing sessions. Complete rewrite of authentication required.', ['AuthAPI', 'SessionAPI', 'UserAPI', 'TokenAPI', 'SecurityAPI']);
            expect(result.severity).toBe('critical');
            expect(result.confidence).toBeGreaterThan(0.7);
            expect(result.indicators).toContain('Several APIs affected (>2)');
        });
        it('should assess high severity correctly', () => {
            const result = categorizationSystem.assessBreakingChangeSeverity('Change core API interface', 'Removes the getUserData method and changes the signature of updateUser method. Incompatible with previous versions.', ['UserAPI', 'DataAPI']);
            expect(result.severity).toBe('high');
            expect(result.confidence).toBeGreaterThan(0.6);
        });
        it('should assess medium severity correctly', () => {
            const result = categorizationSystem.assessBreakingChangeSeverity('Deprecate old configuration format', 'The old JSON configuration format is deprecated in favor of YAML. Updates required for configuration files.', ['ConfigAPI']);
            expect(result.severity).toBe('medium');
            expect(result.reasoning).toContain('1 API(s) affected');
        });
        it('should assess low severity correctly', () => {
            const result = categorizationSystem.assessBreakingChangeSeverity('Minor API parameter change', 'Changes optional parameter name from userId to userIdentifier for consistency. Minor API change with backward compatibility.', []);
            expect(result.severity).toBe('low');
        });
    });
    describe('classifyFeature', () => {
        it('should classify UI/UX features correctly', () => {
            const result = categorizationSystem.classifyFeature('Add responsive navigation component', 'Implements new responsive navigation component that adapts to different screen sizes. Improves user experience on mobile devices.', ['NavigationComponent.tsx', 'MobileMenu.tsx']);
            expect(result.category).toBe('UI/UX');
            expect(result.confidence).toBeGreaterThan(0.3);
            expect(result.benefits.length).toBeGreaterThan(0);
        });
        it('should classify API features correctly', () => {
            const result = categorizationSystem.classifyFeature('Add REST API endpoint for user management', 'Implements new REST API endpoints for creating, updating, and deleting users. Provides comprehensive user management capabilities.', ['UserController.ts', 'UserService.ts', 'UserAPI.ts']);
            expect(result.category).toBe('API');
            expect(result.confidence).toBeGreaterThan(0.3);
        });
        it('should classify performance features correctly', () => {
            const result = categorizationSystem.classifyFeature('Add caching system for data optimization', 'Implements Redis-based caching system that improves performance by reducing database queries. Provides significant speed improvements.', ['CacheService.ts', 'RedisClient.ts']);
            expect(['Performance', 'General']).toContain(result.category);
            expect(result.confidence).toBeGreaterThan(0.3);
        });
        it('should extract benefits from feature descriptions', () => {
            const result = categorizationSystem.classifyFeature('Add user dashboard', 'New dashboard provides users with overview of their account activity. Benefits include improved user engagement and better data visibility. Enables users to track their progress effectively.', []);
            expect(result.benefits.length).toBeGreaterThan(0);
            expect(result.benefits.some(benefit => benefit.includes('improved user engagement'))).toBe(true);
        });
    });
    describe('classifyImprovement', () => {
        it('should classify performance improvements correctly', () => {
            const result = categorizationSystem.classifyImprovement('Optimize database queries', 'Improves performance of user lookup operations by implementing better indexing strategies. Reduces query time by 60% and improves overall system efficiency.');
            expect(result.type).toBe('performance');
            expect(result.impact).toBe('high');
            expect(result.confidence).toBeGreaterThan(0.5);
        });
        it('should classify usability improvements correctly', () => {
            const result = categorizationSystem.classifyImprovement('Enhance user interface accessibility', 'Improves usability by adding keyboard navigation support and screen reader compatibility. Enhances accessibility for users with disabilities.');
            expect(['accessibility', 'usability']).toContain(result.type);
            expect(result.confidence).toBeGreaterThan(0.5);
        });
        it('should classify maintainability improvements correctly', () => {
            const result = categorizationSystem.classifyImprovement('Refactor legacy code structure', 'Refactors old codebase to improve maintainability and code quality. Cleans up technical debt and makes future development easier.');
            expect(result.type).toBe('maintainability');
            expect(result.confidence).toBeGreaterThan(0.6);
        });
        it('should assess improvement impact correctly', () => {
            const highImpactResult = categorizationSystem.classifyImprovement('Major performance optimization', 'Significant performance improvements that dramatically reduce load times and improve user experience substantially.');
            const lowImpactResult = categorizationSystem.classifyImprovement('Minor code cleanup', 'Small improvements to code formatting and minor cleanup of unused variables.');
            expect(highImpactResult.impact).toBe('high');
            expect(lowImpactResult.impact).toBe('low');
        });
    });
    describe('classifyBugFix', () => {
        it('should classify security bug fixes as critical', () => {
            const result = categorizationSystem.classifyBugFix('Fix authentication vulnerability', 'Resolves critical security vulnerability in authentication system that could allow unauthorized access. Patches potential exploit vector.', ['AuthService', 'SecurityModule']);
            expect(result.severity).toBe('critical');
            expect(result.category).toBe('security');
            expect(result.confidence).toBeGreaterThan(0.8);
        });
        it('should classify performance bug fixes correctly', () => {
            const result = categorizationSystem.classifyBugFix('Fix memory leak in data processor', 'Resolves performance issue where memory was not being properly released, causing application slowdown over time.', ['DataProcessor', 'MemoryManager']);
            expect(result.category).toBe('performance');
            expect(result.confidence).toBeGreaterThan(0.7);
        });
        it('should classify UI bug fixes correctly', () => {
            const result = categorizationSystem.classifyBugFix('Fix button display issue', 'Corrects visual problem where buttons were not displaying correctly on mobile devices. Fixes interface rendering bug.', ['ButtonComponent', 'MobileStyles']);
            expect(result.category).toBe('ui');
            expect(result.confidence).toBeGreaterThan(0.6);
        });
        it('should consider affected components in severity assessment', () => {
            const multipleComponentsResult = categorizationSystem.classifyBugFix('Fix data synchronization issue', 'Resolves bug affecting multiple system components.', ['UserService', 'DataService', 'CacheService', 'NotificationService']);
            const singleComponentResult = categorizationSystem.classifyBugFix('Fix minor display issue', 'Resolves small visual bug in single component.', ['ButtonComponent']);
            // Multiple affected components should increase severity
            expect(multipleComponentsResult.reasoning).toContain('Multiple components affected - may indicate systemic issue');
        });
    });
    describe('edge cases and error handling', () => {
        it('should handle empty input gracefully', () => {
            const result = categorizationSystem.categorizeChange('', '', '');
            expect(result.type).toBe('unknown');
            expect(result.confidence).toBeLessThan(0.5);
            expect(result.suggestedCategory).toBeDefined();
        });
        it('should handle mixed signals in categorization', () => {
            const result = categorizationSystem.categorizeChange('Fix and enhance user authentication', 'This change fixes a bug in the authentication system while also adding new OAuth2 support as a feature enhancement.', 'Mixed change type');
            // Should pick the highest confidence match
            expect(['breaking', 'feature', 'bugfix', 'improvement']).toContain(result.type);
            expect(result.confidence).toBeGreaterThan(0.2);
        });
        it('should provide reasonable defaults for unknown patterns', () => {
            const result = categorizationSystem.categorizeChange('Update project configuration', 'Makes some changes to the project setup and configuration files.', 'Generic change');
            expect(result.suggestedCategory).toBe('improvement');
        });
    });
});
//# sourceMappingURL=ChangeCategorizationSystem.test.js.map