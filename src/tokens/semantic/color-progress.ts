/**
 * Semantic Color Tokens: Progress Indicator Family
 * 
 * Color tokens for the Progress Indicator component family, organized by
 * progress state: current, pending, completed, error.
 * 
 * All tokens reference mode-aware primitive color tokens following the
 * concept-first naming model established in Spec 052.
 * 
 * TOKEN COUNT: 10 semantic tokens
 * - current: 2 (background, text)
 * - pending: 3 (background, text, connector)
 * - completed: 3 (background, text, connector)
 * - error: 2 (background, text)
 * 
 * PRIMITIVE REFERENCES:
 * - current: cyan300 (background), cyan400 (text)
 * - pending: white300 (background), gray300 (text), white200 (connector)
 * - completed: green100 (background), green400 (text), green100 (connector)
 * - error: pink100 (background), pink400 (text)
 * 
 * @see .kiro/specs/048-progress-family/requirements.md (Requirements 5.1-5.6)
 * @see .kiro/specs/048-progress-family/design.md (Token Usage sections)
 */

import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';

/**
 * Progress indicator semantic color tokens
 * 
 * 10 tokens organized by progress state concept.
 */
export const progressColorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // ============================================================================
  // CURRENT STATE: Active position ("you are here")
  // Cyan palette — distinct from feedback colors, signals active/focused position
  // ============================================================================

  'color.progress.current.background': {
    name: 'color.progress.current.background',
    primitiveReferences: { value: 'cyan300' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Cyan300 provides a vibrant, accessible background that distinguishes the active position from completed (green) and error (pink) states without conflicting with feedback semantics.',
    description: 'Background color for the currently active progress node — the "you are here" indicator in pagination dots and stepper nodes.'
  },

  'color.progress.current.text': {
    name: 'color.progress.current.text',
    primitiveReferences: { value: 'cyan400' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Cyan400 is darker than cyan300, ensuring sufficient contrast for text/icon content rendered inside the current node background.',
    description: 'Text/icon color for content inside the currently active progress node — checkmarks, step numbers, or icons within the active indicator.'
  },

  // ============================================================================
  // PENDING STATE: Not yet reached / upcoming steps
  // Neutral palette — subdued to indicate incomplete/future position
  // ============================================================================

  'color.progress.pending.background': {
    name: 'color.progress.pending.background',
    primitiveReferences: { value: 'white300' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: White300 provides a subtle, low-emphasis background for incomplete nodes, visually receding behind the active and completed states.',
    description: 'Background color for incomplete/pending progress nodes — upcoming steps that have not been reached yet.'
  },

  'color.progress.pending.text': {
    name: 'color.progress.pending.text',
    primitiveReferences: { value: 'gray300' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Gray300 provides muted text that signals "not yet active" while maintaining readability against the white300 background.',
    description: 'Text/icon color for content inside pending progress nodes — step numbers or icons in upcoming/incomplete steps.'
  },

  'color.progress.pending.connector': {
    name: 'color.progress.pending.connector',
    primitiveReferences: { value: 'white200' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: White200 is lighter than the pending node background (white300), creating a subtle connector line that indicates untraversed path between incomplete steps.',
    description: 'Color for connector lines between incomplete/pending progress nodes — the inactive path segments in steppers.'
  },

  // ============================================================================
  // COMPLETED STATE: Finished steps
  // Green palette — consistent with feedback.success semantics for "done"
  // ============================================================================

  'color.progress.completed.background': {
    name: 'color.progress.completed.background',
    primitiveReferences: { value: 'green100' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Green100 aligns with the established success/completion semantic (feedback.success.background also uses green100), providing immediate recognition of finished steps.',
    description: 'Background color for completed progress nodes — steps that have been successfully finished.'
  },

  'color.progress.completed.text': {
    name: 'color.progress.completed.text',
    primitiveReferences: { value: 'green400' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Green400 provides strong contrast against green100 background for checkmark icons and text content, matching the feedback.success.text pattern.',
    description: 'Text/icon color for content inside completed progress nodes — primarily the checkmark icon that signals step completion.'
  },

  'color.progress.completed.connector': {
    name: 'color.progress.completed.connector',
    primitiveReferences: { value: 'green100' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Green100 for active connectors creates visual continuity between completed nodes, showing the traversed path as a unified green "progress trail."',
    description: 'Color for connector lines between completed progress nodes — the active path segments showing progress already made.'
  },

  // ============================================================================
  // ERROR STATE: Steps with problems
  // Pink palette — consistent with feedback.error semantics for problems
  // ============================================================================

  'color.progress.error.background': {
    name: 'color.progress.error.background',
    primitiveReferences: { value: 'pink100' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Pink100 aligns with the established error semantic (feedback.error.background also uses pink100), providing immediate recognition of problematic steps.',
    description: 'Background color for error progress nodes — steps that have encountered a problem requiring attention.'
  },

  'color.progress.error.text': {
    name: 'color.progress.error.text',
    primitiveReferences: { value: 'pink400' },
    category: SemanticCategory.COLOR,
    context: 'Reasoning: Pink400 provides strong contrast against pink100 background for error icons and text, matching the feedback.error.text pattern.',
    description: 'Text/icon color for content inside error progress nodes — error icons or indicators within problematic steps.'
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/** All progress color token names for validation and iteration */
export const progressColorTokenNames = Object.keys(progressColorTokens);

/** Expected token count for governance validation */
export const PROGRESS_COLOR_TOKEN_COUNT = 10;

/**
 * Get a single progress color token by name
 */
export function getProgressColorToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return progressColorTokens[name];
}

/**
 * Get all progress color tokens as an array
 */
export function getAllProgressColorTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(progressColorTokens);
}

/**
 * Validate that the progress color token count matches the expected count (10)
 */
export function validateProgressColorTokenCount(): boolean {
  return Object.keys(progressColorTokens).length === PROGRESS_COLOR_TOKEN_COUNT;
}
