/**
 * Integration Module - Barrel Export
 * 
 * Exports all integration coordinators that orchestrate interactions between
 * registries, validators, and translation providers in the token system.
 */

export { RegistryCoordinator } from './RegistryCoordinator';
export type { RegistryCoordinationStats } from './RegistryCoordinator';

export { ValidationCoordinator } from './ValidationCoordinator';
export type { 
  ValidationCoordinatorConfig,
  ValidationOptions,
  ComprehensiveValidationReport
} from './ValidationCoordinator';

export { TranslationCoordinator } from './TranslationCoordinator';
export type { TranslationCoordinatorConfig } from './TranslationCoordinator';
