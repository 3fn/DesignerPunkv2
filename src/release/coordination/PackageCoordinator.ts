/**
 * Package Coordinator
 * 
 * Manages versioning and dependency relationships across multiple packages
 * in the DesignerPunk ecosystem.
 * 
 * Requirements:
 * - 4.1: Core package synchronization
 * - 4.2: Component package independence
 * - 4.3: Dependency relationship management
 * - 4.4: Version conflict resolution
 * - 4.5: Publishing order coordination
 */

import * as semver from 'semver';
import {
  PackageVersion,
  PackageUpdate,
  DependencyUpdate,
  VersionConflict,
  CoordinationStrategy,
  CoordinationPlan,
  CompatibilityReport,
  CompatibilityIssue,
  CompatibilityWarning,
  PublishingPlan
} from './types';

export class PackageCoordinator {
  private strategy: CoordinationStrategy;

  constructor(strategy: CoordinationStrategy) {
    this.strategy = strategy;
  }

  /**
   * Coordinate versions across multiple packages
   * 
   * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
   */
  coordinateVersions(
    packages: PackageVersion[],
    proposedUpdates: Map<string, string>
  ): CoordinationPlan {
    // Determine which packages need updates
    const packageUpdates = this.determinePackageUpdates(packages, proposedUpdates);

    // Apply core package synchronization if enabled
    const synchronizedUpdates = this.applyCorePackageSync(packages, packageUpdates);

    // Calculate dependency updates
    const dependencyUpdates = this.calculateDependencyUpdates(
      packages,
      synchronizedUpdates
    );

    // Detect conflicts
    const conflicts = this.detectConflicts(packages, synchronizedUpdates);

    // Generate publishing order
    const publishingOrder = this.generatePublishingOrder(
      packages,
      synchronizedUpdates
    );

    return {
      packages: synchronizedUpdates,
      dependencyUpdates,
      publishingOrder,
      conflicts,
      strategy: this.strategy
    };
  }

  /**
   * Update package dependencies based on coordination plan
   * 
   * Requirements: 4.3
   */
  updateDependencies(plan: CoordinationPlan): DependencyUpdate[] {
    return plan.dependencyUpdates;
  }

  /**
   * Validate package compatibility
   * 
   * Requirements: 4.4
   */
  validatePackageCompatibility(packages: PackageVersion[]): CompatibilityReport {
    const issues: CompatibilityIssue[] = [];
    const warnings: CompatibilityWarning[] = [];

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(packages);
    if (circularDeps.length > 0) {
      issues.push({
        severity: 'error',
        package: circularDeps[0],
        dependency: circularDeps[1] || '',
        description: `Circular dependency detected: ${circularDeps.join(' -> ')}`,
        suggestedFix: 'Restructure packages to remove circular dependency'
      });
    }

    // Check for version mismatches
    for (const pkg of packages) {
      const versionIssues = this.checkVersionCompatibility(pkg, packages);
      issues.push(...versionIssues);
    }

    // Check for missing dependencies
    for (const pkg of packages) {
      const missingDeps = this.checkMissingDependencies(pkg, packages);
      warnings.push(...missingDeps);
    }

    return {
      compatible: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Generate publishing order based on dependencies
   * 
   * Requirements: 4.5
   */
  generatePublishingOrder(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): string[] {
    // Build dependency graph
    const graph = this.buildDependencyGraph(packages);

    // Topological sort to determine publishing order
    const order = this.topologicalSort(graph);

    // Filter to only include packages being updated
    const updatedPackageNames = new Set(updates.map(u => u.name));
    return order.filter(name => updatedPackageNames.has(name));
  }

  /**
   * Determine package updates based on proposed versions
   * 
   * Requirements: 4.1, 4.2
   */
  private determinePackageUpdates(
    packages: PackageVersion[],
    proposedUpdates: Map<string, string>
  ): PackageUpdate[] {
    const updates: PackageUpdate[] = [];

    for (const pkg of packages) {
      const proposedVersion = proposedUpdates.get(pkg.name);
      if (!proposedVersion || proposedVersion === pkg.currentVersion) {
        continue;
      }

      // Validate version format
      if (!semver.valid(proposedVersion)) {
        // Skip invalid versions
        continue;
      }

      const bumpType = this.determineBumpType(pkg.currentVersion, proposedVersion);
      updates.push({
        name: pkg.name,
        currentVersion: pkg.currentVersion,
        newVersion: proposedVersion,
        path: pkg.path,
        bumpType,
        reason: `Version bump from ${pkg.currentVersion} to ${proposedVersion}`
      });
    }

    return updates;
  }

  /**
   * Apply core package synchronization
   * 
   * Requirements: 4.1
   */
  private applyCorePackageSync(
    allPackages: PackageVersion[],
    updates: PackageUpdate[]
  ): PackageUpdate[] {
    if (!this.strategy.corePackageSync) {
      return updates;
    }

    const corePackages = this.strategy.corePackages || [];
    const coreUpdates = updates.filter(u => corePackages.includes(u.name));

    if (coreUpdates.length === 0) {
      return updates;
    }

    // Find the highest version bump among core packages
    const highestBump = this.findHighestBump(coreUpdates);
    
    // Try to find highest version, handle invalid versions gracefully
    let highestVersion: string;
    try {
      highestVersion = this.findHighestVersion(coreUpdates.map(u => u.newVersion));
    } catch (error) {
      // If no valid versions, return updates unchanged
      return updates;
    }

    // Synchronize all core packages to the highest version
    const synchronizedUpdates = [...updates];
    
    // Add or update all core packages to match the highest version
    for (const corePackageName of corePackages) {
      const existingIndex = synchronizedUpdates.findIndex(u => u.name === corePackageName);
      
      if (existingIndex >= 0) {
        // Update existing core package
        synchronizedUpdates[existingIndex] = {
          ...synchronizedUpdates[existingIndex],
          newVersion: highestVersion,
          bumpType: highestBump,
          reason: `Synchronized with core packages to ${highestVersion}`
        };
      } else {
        // Add missing core package to updates
        const packageInfo = allPackages.find(p => p.name === corePackageName);
        if (packageInfo) {
          synchronizedUpdates.push({
            name: packageInfo.name,
            currentVersion: packageInfo.currentVersion,
            newVersion: highestVersion,
            bumpType: highestBump,
            path: packageInfo.path,
            reason: `Synchronized with core packages to ${highestVersion}`
          });
        }
      }
    }

    return synchronizedUpdates;
  }

  /**
   * Calculate dependency updates based on package updates
   * 
   * Requirements: 4.3
   */
  private calculateDependencyUpdates(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): DependencyUpdate[] {
    const dependencyUpdates: DependencyUpdate[] = [];
    const updateMap = new Map(updates.map(u => [u.name, u.newVersion]));

    for (const pkg of packages) {
      // Check dependencies
      if (pkg.dependencies) {
        for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
          const newVersion = updateMap.get(depName);
          if (newVersion && newVersion !== depVersion) {
            dependencyUpdates.push({
              package: pkg.name,
              dependency: depName,
              currentVersion: depVersion,
              newVersion: `^${newVersion}`,
              type: 'dependencies'
            });
          }
        }
      }

      // Check devDependencies
      if (pkg.devDependencies) {
        for (const [depName, depVersion] of Object.entries(pkg.devDependencies)) {
          const newVersion = updateMap.get(depName);
          if (newVersion && newVersion !== depVersion) {
            dependencyUpdates.push({
              package: pkg.name,
              dependency: depName,
              currentVersion: depVersion,
              newVersion: `^${newVersion}`,
              type: 'devDependencies'
            });
          }
        }
      }

      // Check peerDependencies
      if (pkg.peerDependencies) {
        for (const [depName, depVersion] of Object.entries(pkg.peerDependencies)) {
          const newVersion = updateMap.get(depName);
          if (newVersion && newVersion !== depVersion) {
            dependencyUpdates.push({
              package: pkg.name,
              dependency: depName,
              currentVersion: depVersion,
              newVersion: `^${newVersion}`,
              type: 'peerDependencies'
            });
          }
        }
      }
    }

    return dependencyUpdates;
  }

  /**
   * Detect version conflicts
   * 
   * Requirements: 4.4
   */
  private detectConflicts(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): VersionConflict[] {
    const conflicts: VersionConflict[] = [];

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(packages);
    if (circularDeps.length > 0) {
      conflicts.push({
        package: circularDeps[0],
        conflictType: 'circular',
        description: `Circular dependency: ${circularDeps.join(' -> ')}`,
        affectedPackages: circularDeps,
        suggestedResolution: 'Restructure packages to remove circular dependency'
      });
    }

    // Check for incompatible version requirements
    const updateMap = new Map(updates.map(u => [u.name, u.newVersion]));
    for (const pkg of packages) {
      if (pkg.dependencies) {
        for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
          const newVersion = updateMap.get(depName);
          if (newVersion && !this.isVersionCompatible(depVersion, newVersion)) {
            conflicts.push({
              package: pkg.name,
              conflictType: 'incompatible',
              description: `Incompatible version: ${pkg.name} requires ${depName}@${depVersion}, but ${newVersion} will be published`,
              affectedPackages: [pkg.name, depName],
              suggestedResolution: `Update ${pkg.name} dependency to ^${newVersion}`
            });
          }
        }
      }
    }

    return conflicts;
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(packages: PackageVersion[]): string[] {
    const graph = this.buildDependencyGraph(packages);
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCycle = (node: string, path: string[]): string[] | null => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const cycle = detectCycle(neighbor, [...path]);
          if (cycle) return cycle;
        } else if (recursionStack.has(neighbor)) {
          // Found cycle
          const cycleStart = path.indexOf(neighbor);
          return path.slice(cycleStart).concat(neighbor);
        }
      }

      recursionStack.delete(node);
      return null;
    };

    for (const pkg of packages) {
      if (!visited.has(pkg.name)) {
        const cycle = detectCycle(pkg.name, []);
        if (cycle) return cycle;
      }
    }

    return [];
  }

  /**
   * Build dependency graph
   */
  private buildDependencyGraph(packages: PackageVersion[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();

    for (const pkg of packages) {
      const deps: string[] = [];

      if (pkg.dependencies) {
        deps.push(...Object.keys(pkg.dependencies));
      }
      if (pkg.devDependencies) {
        deps.push(...Object.keys(pkg.devDependencies));
      }
      if (pkg.peerDependencies) {
        deps.push(...Object.keys(pkg.peerDependencies));
      }

      // Filter to only include packages in our ecosystem
      const packageNames = new Set(packages.map(p => p.name));
      const filteredDeps = deps.filter(dep => packageNames.has(dep));

      graph.set(pkg.name, filteredDeps);
    }

    return graph;
  }

  /**
   * Topological sort for publishing order
   */
  private topologicalSort(graph: Map<string, string[]>): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (node: string) => {
      if (visited.has(node)) return;
      visited.add(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        visit(neighbor);
      }

      result.push(node);
    };

    for (const node of graph.keys()) {
      visit(node);
    }

    return result;
  }

  /**
   * Determine bump type between two versions
   */
  private determineBumpType(
    currentVersion: string,
    newVersion: string
  ): 'major' | 'minor' | 'patch' | 'none' {
    const current = semver.parse(currentVersion);
    const next = semver.parse(newVersion);

    if (!current || !next) return 'none';

    if (next.major > current.major) return 'major';
    if (next.minor > current.minor) return 'minor';
    if (next.patch > current.patch) return 'patch';

    return 'none';
  }

  /**
   * Find highest bump type
   */
  private findHighestBump(updates: PackageUpdate[]): 'major' | 'minor' | 'patch' | 'none' {
    const bumpPriority = { major: 3, minor: 2, patch: 1, none: 0 };
    let highest: 'major' | 'minor' | 'patch' | 'none' = 'none';

    for (const update of updates) {
      if (bumpPriority[update.bumpType] > bumpPriority[highest]) {
        highest = update.bumpType;
      }
    }

    return highest;
  }

  /**
   * Find highest version
   */
  private findHighestVersion(versions: string[]): string {
    // Filter out invalid versions
    const validVersions = versions.filter(v => semver.valid(v));
    
    if (validVersions.length === 0) {
      throw new Error('No valid versions provided');
    }
    
    return validVersions.reduce((highest, current) => {
      return semver.gt(current, highest) ? current : highest;
    }, validVersions[0]);
  }

  /**
   * Check if version is compatible with requirement
   */
  private isVersionCompatible(requirement: string, version: string): boolean {
    try {
      return semver.satisfies(version, requirement);
    } catch {
      return false;
    }
  }

  /**
   * Check version compatibility for a package
   */
  private checkVersionCompatibility(
    pkg: PackageVersion,
    allPackages: PackageVersion[]
  ): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];
    const packageMap = new Map(allPackages.map(p => [p.name, p]));

    if (pkg.dependencies) {
      for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
        const depPkg = packageMap.get(depName);
        if (depPkg && !this.isVersionCompatible(depVersion, depPkg.currentVersion)) {
          issues.push({
            severity: 'error',
            package: pkg.name,
            dependency: depName,
            description: `Version mismatch: ${pkg.name} requires ${depName}@${depVersion}, but ${depPkg.currentVersion} is available`,
            suggestedFix: `Update ${pkg.name} to require ${depName}@^${depPkg.currentVersion}`
          });
        }
      }
    }

    return issues;
  }

  /**
   * Check for missing dependencies
   */
  private checkMissingDependencies(
    pkg: PackageVersion,
    allPackages: PackageVersion[]
  ): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];
    const packageNames = new Set(allPackages.map(p => p.name));

    if (pkg.dependencies) {
      for (const depName of Object.keys(pkg.dependencies)) {
        if (depName.startsWith('@designerpunk/') && !packageNames.has(depName)) {
          warnings.push({
            package: pkg.name,
            message: `Dependency ${depName} not found in package list`,
            recommendation: 'Verify that all DesignerPunk packages are included in coordination'
          });
        }
      }
    }

    return warnings;
  }
}
