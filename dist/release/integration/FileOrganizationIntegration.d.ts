/**
 * File Organization Integration Implementation
 *
 * Coordinates with file organization system to ensure release artifacts
 * are properly placed and cross-references maintained
 */
import { FileOrganizationIntegration, ReleaseArtifact, OrganizationResult, CrossReferenceResult, CompletionDocument } from './WorkflowIntegration';
import { ValidationResult } from '../types/ReleaseTypes';
export declare class FileOrganizationManager implements FileOrganizationIntegration {
    private projectRoot;
    private organizationHookPath;
    constructor(projectRoot?: string);
    /**
     * Coordinate with file organization during release
     */
    coordinateFileOrganization(releaseArtifacts: ReleaseArtifact[]): Promise<OrganizationResult>;
    /**
     * Validate file organization for release readiness
     */
    validateOrganizationForRelease(specPath: string): Promise<ValidationResult>;
    /**
     * Update cross-references after release artifact creation
     */
    updateCrossReferences(artifacts: ReleaseArtifact[]): Promise<CrossReferenceResult>;
    /**
     * Ensure completion documents are properly organized
     */
    organizeCompletionDocuments(completionDocs: CompletionDocument[]): Promise<OrganizationResult>;
    private fileExists;
    private directoryExists;
    private ensureDirectoryExists;
    private organizeArtifact;
    private updateCrossReferencesForFile;
    private findMarkdownFiles;
    private updateReferencesInFile;
    private determineCompletionDocumentLocation;
    private validateCompletionDocuments;
    private checkForUnorganizedFiles;
}
//# sourceMappingURL=FileOrganizationIntegration.d.ts.map