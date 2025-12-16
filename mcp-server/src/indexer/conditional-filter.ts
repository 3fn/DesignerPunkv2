/**
 * Conditional Section Filter
 * 
 * Mechanically extracts conditional markers from markdown documents and
 * provides filtering logic based on task types. Uses the Spec 020 format
 * for conditional section markers.
 * 
 * Does NOT interpret content or follow instructions - only extracts
 * marker data for filtering decisions.
 */

import { Section } from '../models/Section';

/**
 * Conditional markers extracted from a section
 */
export interface ConditionalMarkers {
  /** Criteria for when to load the section */
  loadCriteria: string[];
  
  /** Criteria for when to skip the section */
  skipCriteria: string[];
}

/**
 * Section with conditional markers attached
 */
export interface ConditionalSection {
  /** Section heading */
  heading: string;
  
  /** Conditional markers (null if no markers present) */
  markers: ConditionalMarkers | null;
  
  /** Start line of the section in the document */
  startLine: number;
  
  /** End line of the section in the document */
  endLine: number;
}

/**
 * Extract conditional markers from markdown content
 * 
 * Parses the Spec 020 format:
 * ```
 * **📖 CONDITIONAL SECTION - Read only when needed**
 * 
 * **Load when**: 
 * - Condition 1
 * - Condition 2
 * 
 * **Skip when**: 
 * - Condition 1
 * - Condition 2
 * ```
 * 
 * Does NOT interpret the conditions - only extracts them as strings.
 * 
 * @param content - Markdown content to parse
 * @returns ConditionalMarkers or null if no markers found
 */
export function extractConditionalMarkers(content: string): ConditionalMarkers | null {
  // Check for conditional section marker
  const markerRegex = /\*\*📖 CONDITIONAL SECTION[^\n]*\*\*/;
  if (!markerRegex.test(content)) {
    return null;
  }
  
  const loadCriteria: string[] = [];
  const skipCriteria: string[] = [];
  
  // Extract "Load when" criteria
  // Match **Load when**: followed by list items
  const loadWhenRegex = /\*\*Load when\*\*:\s*\n((?:[-*]\s+.+\n?)+)/gi;
  const loadMatch = loadWhenRegex.exec(content);
  if (loadMatch) {
    const loadLines = loadMatch[1].split('\n');
    for (const line of loadLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const criterion = trimmed.replace(/^[-*]\s*/, '').trim();
        if (criterion) {
          loadCriteria.push(criterion);
        }
      }
    }
  }
  
  // Extract "Skip when" criteria
  // Match **Skip when**: followed by list items
  const skipWhenRegex = /\*\*Skip when\*\*:\s*\n((?:[-*]\s+.+\n?)+)/gi;
  const skipMatch = skipWhenRegex.exec(content);
  if (skipMatch) {
    const skipLines = skipMatch[1].split('\n');
    for (const line of skipLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const criterion = trimmed.replace(/^[-*]\s*/, '').trim();
        if (criterion) {
          skipCriteria.push(criterion);
        }
      }
    }
  }
  
  // Return null if no criteria found (marker present but no conditions)
  if (loadCriteria.length === 0 && skipCriteria.length === 0) {
    return null;
  }
  
  return {
    loadCriteria,
    skipCriteria
  };
}


/**
 * Check if a criterion matches a task type using keyword matching
 * 
 * Uses simple keyword matching to determine if a criterion applies
 * to a given task type. The matching is case-insensitive and checks
 * if any task type keyword appears in the criterion text.
 * 
 * @param criterion - The criterion text from Load when/Skip when
 * @param taskType - The task type to match (e.g., "component-development", "spec-creation")
 * @returns true if the criterion matches the task type
 */
export function matchesTaskType(criterion: string, taskType: string): boolean {
  if (!criterion || !taskType) {
    return false;
  }
  
  const criterionLower = criterion.toLowerCase();
  
  // Split task type by hyphens to get individual keywords
  // e.g., "component-development" -> ["component", "development"]
  const taskKeywords = taskType.toLowerCase().split('-');
  
  // Check if any task keyword appears in the criterion
  for (const keyword of taskKeywords) {
    if (keyword.length > 2 && criterionLower.includes(keyword)) {
      return true;
    }
  }
  
  // Also check if the full task type appears in the criterion
  if (criterionLower.includes(taskType.toLowerCase())) {
    return true;
  }
  
  return false;
}

/**
 * Determine if a section should be included based on task type
 * 
 * Filtering logic:
 * 1. If no conditional markers, include by default
 * 2. Check skip criteria first - if any match, exclude
 * 3. If load criteria exist, at least one must match to include
 * 4. If no load criteria, include by default (unless skipped)
 * 
 * @param section - Section with optional conditional markers
 * @param taskType - Current task type for filtering
 * @param markers - Optional conditional markers (if not attached to section)
 * @returns true if section should be included
 */
export function shouldIncludeSection(
  section: Section | { heading: string; content: string },
  taskType: string,
  markers?: ConditionalMarkers | null
): boolean {
  // If no markers provided, try to extract from section content
  const conditionalMarkers = markers ?? extractConditionalMarkers(section.content);
  
  // If no markers, include by default
  if (!conditionalMarkers) {
    return true;
  }
  
  // Check skip criteria first (explicit exclusion takes priority)
  for (const skipCriterion of conditionalMarkers.skipCriteria) {
    if (matchesTaskType(skipCriterion, taskType)) {
      return false;
    }
  }
  
  // Check load criteria (explicit inclusion)
  if (conditionalMarkers.loadCriteria.length > 0) {
    for (const loadCriterion of conditionalMarkers.loadCriteria) {
      if (matchesTaskType(loadCriterion, taskType)) {
        return true;
      }
    }
    // Has load criteria but none matched - exclude
    return false;
  }
  
  // No skip match, no load criteria - include by default
  return true;
}

/**
 * Extract all conditional sections from a document
 * 
 * Scans the document for sections with conditional markers and
 * returns information about each conditional section found.
 * 
 * @param content - Full document content
 * @returns Array of conditional sections with their markers
 */
export function extractAllConditionalSections(content: string): ConditionalSection[] {
  const conditionalSections: ConditionalSection[] = [];
  const lines = content.split('\n');
  
  let currentHeading: string | null = null;
  let currentHeadingLine = 0;
  let sectionContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for heading (H2 or H3)
    const headingMatch = /^(#{2,3})\s+(.+)$/.exec(line);
    
    if (headingMatch) {
      // Process previous section if it exists
      if (currentHeading && sectionContent.length > 0) {
        const markers = extractConditionalMarkers(sectionContent.join('\n'));
        if (markers) {
          conditionalSections.push({
            heading: currentHeading,
            markers,
            startLine: currentHeadingLine,
            endLine: i - 1
          });
        }
      }
      
      // Start new section
      currentHeading = headingMatch[2].trim();
      currentHeadingLine = i;
      sectionContent = [line];
    } else if (currentHeading) {
      sectionContent.push(line);
    }
  }
  
  // Process last section
  if (currentHeading && sectionContent.length > 0) {
    const markers = extractConditionalMarkers(sectionContent.join('\n'));
    if (markers) {
      conditionalSections.push({
        heading: currentHeading,
        markers,
        startLine: currentHeadingLine,
        endLine: lines.length - 1
      });
    }
  }
  
  return conditionalSections;
}

/**
 * Filter sections by task type
 * 
 * Takes an array of sections and returns only those that should
 * be included for the given task type.
 * 
 * @param sections - Array of sections to filter
 * @param taskType - Task type to filter by
 * @returns Filtered array of sections
 */
export function filterSectionsByTaskType<T extends { heading: string; content: string }>(
  sections: T[],
  taskType: string
): T[] {
  return sections.filter(section => shouldIncludeSection(section, taskType));
}
