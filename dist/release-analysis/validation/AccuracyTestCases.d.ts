/**
 * Accuracy Test Cases
 *
 * Predefined test cases with known completion documents and expected results
 * for validating extraction and categorization accuracy.
 */
import { AccuracyTestCase } from './AccuracyValidationFramework';
/**
 * Collection of test cases for accuracy validation
 */
export declare class AccuracyTestCases {
    /**
     * Get all predefined test cases
     */
    static getAllTestCases(): AccuracyTestCase[];
    /**
     * Test case: Well-structured document with clear breaking changes
     */
    static getStructuredBreakingChangeTestCase(): AccuracyTestCase;
    /**
     * Test case: Well-structured document with new features
     */
    static getStructuredFeatureTestCase(): AccuracyTestCase;
    /**
     * Test case: Well-structured document with bug fixes
     */
    static getStructuredBugFixTestCase(): AccuracyTestCase;
    /**
     * Test case: Unstructured document with mixed changes
     */
    static getUnstructuredMixedTestCase(): AccuracyTestCase;
    /**
     * Test case: Complex structured document with multiple sections
     */
    static getComplexStructuredTestCase(): AccuracyTestCase;
    /**
     * Test case: Edge case - Empty document
     */
    static getEdgeCaseEmptyTestCase(): AccuracyTestCase;
    /**
     * Test case: Edge case - Documentation only
     */
    static getEdgeCaseDocumentationOnlyTestCase(): AccuracyTestCase;
    /**
     * Test case: High confidence scenario
     */
    static getHighConfidenceTestCase(): AccuracyTestCase;
    /**
     * Test case: Low confidence scenario
     */
    static getLowConfidenceTestCase(): AccuracyTestCase;
    /**
     * Test case: Version bump - Major
     */
    static getVersionBumpMajorTestCase(): AccuracyTestCase;
    /**
     * Test case: Version bump - Minor
     */
    static getVersionBumpMinorTestCase(): AccuracyTestCase;
    /**
     * Test case: Version bump - Patch
     */
    static getVersionBumpPatchTestCase(): AccuracyTestCase;
    /**
     * Test case: Version bump - None
     */
    static getVersionBumpNoneTestCase(): AccuracyTestCase;
}
//# sourceMappingURL=AccuracyTestCases.d.ts.map