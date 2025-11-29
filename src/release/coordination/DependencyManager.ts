/**
 * Dependency Manager
 * 
 * Manages dependency graph analysis, conflict detection, and compatibility validation
 * for multi-package coordination.
 * 
 * Requirements:
 * - 4.3: Dependency relationship management and updates
 * - 4.4: Dependency conflict detection and resolution
 * - 4.5: Cross-package compatibility validation
 */

import * as semver from 'semver';
import {
  PackageVersion,
  PackageUpdate,
  DependencyUpdate,
  VersionConflict,
  CompatibilityReport,
  CompatibilityIssue,
  CompatibilityWarning
} from './types';

/**
 * Dependency graph node
 */
interface DependencyNode {
  name: string;
  version: string;
  dependencies: string[];
  dependents: string[];
}

/**
 * Dependency graph
 */
export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
  edges: Map<string, Set<string>>;
}

/**
 * Dependency analysis result
 */
export interface DependencyAnalysis {
  graph: DependencyGraph;
  levels: string[][];
  circularDependencies: string[][];
  orphanedPackages: string[];
}

/**
 * Conflict resolution strategy
 */
export interface ConflictResolution {
  conflict: VersionConflict;
  strategy: 'update-dependent' | 'update-dependency' | 'manual';
  suggestedActions: string[];
}

export class DependencyManager {
  /**
   * Analyze dependency graph
   * 
   * Requirements: 4.3
   */
  analyzeDependencyGraph(packages: PackageVersion[]): DependencyAnalysis {
    const graph = this.buildDependencyGraph(packages);
    const levels = this.calculateDependencyLevels(graph);
    const circularDependencies = this.findCircularDependencies(graph);
    const orphanedPackages = this.findOrphanedPackages(graph, packages);

    return {
      graph,
      levels,
      circularDependencies,
      orphanedPackages
    };
  }

  /**
   * Calculate dependency updates based on package updates
   * 
   * Requirements: 4.3
   */
  calculateDependencyUpdates(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): DependencyUpdate[] {
    const dependencyUpdates: DependencyUpdate[] = [];
    const updateMap = new Map(updates.map(u => [u.name, u.newVersion]));

    for (const pkg of packages) {
      // Check dependencies
      if (pkg.dependencies) {
        const deps = this.checkDependencyType(
          pkg,
          pkg.dependencies,
          updateMap,
          'dependencies'
        );
        dependencyUpdates.push(...deps);
      }

      // Check devDependencies
      if (pkg.devDependencies) {
        const deps = this.checkDependencyType(
          pkg,
          pkg.devDependencies,
          updateMap,
          'devDependencies'
        );
        dependencyUpdates.push(...deps);
      }

      // Check peerDependencies
      if (pkg.peerDependencies) {
        const deps = this.checkDependencyType(
          pkg,
          pkg.peerDependencies,
          updateMap,
          'peerDependencies'
        );
        dependencyUpdates.push(...deps);
      }
    }

    return dependencyUpdates;
  }

  /**
   * Detect dependency conflicts
   * 
   * Requirements: 4.4
   */
  detectConflicts(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): VersionConflict[] {
    const conflicts: VersionConflict[] = [];

    // Detect circular dependencies
    const analysis = this.analyzeDependencyGraph(packages);
    for (const cycle of analysis.circularDependencies) {
      conflicts.push({
        package: cycle[0],
        conflictType: 'circular',
        description: `Circular dependency detected: ${cycle.join(' -> ')}`,
        affectedPackages: cycle,
        suggestedResolution: 'Restructure packages to remove circular dependency'
      });
    }

    // Detect version incompatibilities
    const updateMap = new Map(updates.map(u => [u.name, u.newVersion]));
    const incompatibilities = this.detectVersionIncompatibilities(
      packages,
      updateMap
    );
    conflicts.push(...incompatibilities);

    // Detect missing dependencies
    const missingDeps = this.detectMissingDependencies(packages, updates);
    conflicts.push(...missingDeps);

    return conflicts;
  }

  /**
   * Resolve dependency conflicts
   * 
   * Requirements: 4.4
   */
  resolveConflicts(
    conflicts: VersionConflict[],
    packages: PackageVersion[]
  ): ConflictResolution[] {
    const resolutions: ConflictResolution[] = [];

    for (const conflict of conflicts) {
      const resolution = this.determineResolutionStrategy(conflict, packages);
      resolutions.push(resolution);
    }

    return resolutions;
  }

  /**
   * Validate cross-package compatibility
   * 
   * Requirements: 4.5
   */
  validateCompatibility(
    packages: PackageVersion[],
    updates?: PackageUpdate[]
  ): CompatibilityReport {
    const issues: CompatibilityIssue[] = [];
    const warnings: CompatibilityWarning[] = [];

    // Create a map of current or updated versions
    const versionMap = new Map(packages.map(p => [p.name, p.currentVersion]));
    if (updates) {
      for (const update of updates) {
        versionMap.set(update.name, update.newVersion);
      }
    }

    // Check each package's dependencies
    for (const pkg of packages) {
      const pkgIssues = this.validatePackageDependencies(pkg, versionMap);
      issues.push(...pkgIssues);

      const pkgWarnings = this.checkPackageWarnings(pkg, packages);
      warnings.push(...pkgWarnings);
    }

    // Check for circular dependencies
    const analysis = this.analyzeDependencyGraph(packages);
    if (analysis.circularDependencies.length > 0) {
      for (const cycle of analysis.circularDependencies) {
        issues.push({
          severity: 'error',
          package: cycle[0],
          dependency: cycle[1] || '',
          description: `Circular dependency: ${cycle.join(' -> ')}`,
          suggestedFix: 'Restructure packages to remove circular dependency'
        });
      }
    }

    return {
      compatible: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      warnings
    };
  }

  /**
   * Build dependency graph from packages
   */
  private buildDependencyGraph(packages: PackageVersion[]): DependencyGraph {
    const nodes = new Map<string, DependencyNode>();
    const edges = new Map<string, Set<string>>();

    // Initialize nodes
    for (const pkg of packages) {
      nodes.set(pkg.name, {
        name: pkg.name,
        version: pkg.currentVersion,
        dependencies: [],
        dependents: []
      });
      edges.set(pkg.name, new Set());
    }

    // Build edges
    for (const pkg of packages) {
      const node = nodes.get(pkg.name)!;
      const allDeps = this.getAllDependencies(pkg);

      for (const dep of allDeps) {
        if (nodes.has(dep)) {
          node.dependencies.push(dep);
          edges.get(pkg.name)!.add(dep);

          // Add reverse edge (dependent)
          const depNode = nodes.get(dep)!;
          depNode.dependents.push(pkg.name);
        }
      }
    }

    return { nodes, edges };
  }

  /**
   * Calculate dependency levels (topological sort)
   */
  private calculateDependencyLevels(graph: DependencyGraph): string[][] {
    const levels: string[][] = [];
    const visited = new Set<string>();
    const inDegree = new Map<string, number>();

    // Calculate in-degree for each node
    for (const [name, node] of graph.nodes) {
      inDegree.set(name, node.dependencies.length);
    }

    // Process nodes level by level
    while (visited.size < graph.nodes.size) {
      const currentLevel: string[] = [];

      // Find all nodes with in-degree 0
      for (const [name, degree] of inDegree) {
        if (degree === 0 && !visited.has(name)) {
          currentLevel.push(name);
        }
      }

      if (currentLevel.length === 0) {
        // Circular dependency detected, add remaining nodes
        for (const name of graph.nodes.keys()) {
          if (!visited.has(name)) {
            currentLevel.push(name);
          }
        }
      }

      // Mark nodes as visited and update in-degrees
      for (const name of currentLevel) {
        visited.add(name);
        const dependents = graph.nodes.get(name)!.dependents;
        for (const dependent of dependents) {
          const currentDegree = inDegree.get(dependent) || 0;
          inDegree.set(dependent, currentDegree - 1);
        }
      }

      levels.push(currentLevel);
    }

    return levels;
  }

  /**
   * Find circular dependencies using DFS
   */
  private findCircularDependencies(graph: DependencyGraph): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (node: string, path: string[]): void => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = graph.edges.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recursionStack.has(neighbor)) {
          // Found a cycle
          const cycleStart = path.indexOf(neighbor);
          const cycle = path.slice(cycleStart).concat(neighbor);
          cycles.push(cycle);
        }
      }

      recursionStack.delete(node);
    };

    for (const node of graph.nodes.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }

  /**
   * Find orphaned packages (no dependencies or dependents)
   */
  private findOrphanedPackages(
    graph: DependencyGraph,
    packages: PackageVersion[]
  ): string[] {
    const orphaned: string[] = [];

    for (const pkg of packages) {
      const node = graph.nodes.get(pkg.name);
      if (node && node.dependencies.length === 0 && node.dependents.length === 0) {
        orphaned.push(pkg.name);
      }
    }

    return orphaned;
  }

  /**
   * Get all dependencies for a package
   */
  private getAllDependencies(pkg: PackageVersion): string[] {
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

    return deps;
  }

  /**
   * Check dependencies of a specific type
   */
  private checkDependencyType(
    pkg: PackageVersion,
    dependencies: Record<string, string>,
    updateMap: Map<string, string>,
    type: 'dependencies' | 'devDependencies' | 'peerDependencies'
  ): DependencyUpdate[] {
    const updates: DependencyUpdate[] = [];

    for (const [depName, depVersion] of Object.entries(dependencies)) {
      const newVersion = updateMap.get(depName);
      if (newVersion && newVersion !== depVersion) {
        updates.push({
          package: pkg.name,
          dependency: depName,
          currentVersion: depVersion,
          newVersion: this.formatVersionRange(newVersion, type),
          type
        });
      }
    }

    return updates;
  }

  /**
   * Format version range based on dependency type
   */
  private formatVersionRange(
    version: string,
    type: 'dependencies' | 'devDependencies' | 'peerDependencies'
  ): string {
    // Use caret range for dependencies and devDependencies
    if (type === 'dependencies' || type === 'devDependencies') {
      return `^${version}`;
    }
    // Use more flexible range for peerDependencies
    return `>=${version}`;
  }

  /**
   * Detect version incompatibilities
   */
  private detectVersionIncompatibilities(
    packages: PackageVersion[],
    updateMap: Map<string, string>
  ): VersionConflict[] {
    const conflicts: VersionConflict[] = [];

    for (const pkg of packages) {
      if (pkg.dependencies) {
        for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
          const newVersion = updateMap.get(depName);
          if (newVersion && !this.isVersionCompatible(depVersion, newVersion)) {
            conflicts.push({
              package: pkg.name,
              conflictType: 'incompatible',
              description: `${pkg.name} requires ${depName}@${depVersion}, but ${newVersion} will be published`,
              affectedPackages: [pkg.name, depName],
              suggestedResolution: `Update ${pkg.name} to require ${depName}@^${newVersion}`
            });
          }
        }
      }
    }

    return conflicts;
  }

  /**
   * Detect missing dependencies
   */
  private detectMissingDependencies(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): VersionConflict[] {
    const conflicts: VersionConflict[] = [];
    const packageNames = new Set(packages.map(p => p.name));
    const updateNames = new Set(updates.map(u => u.name));

    for (const pkg of packages) {
      const allDeps = this.getAllDependencies(pkg);
      for (const dep of allDeps) {
        // Check if dependency is in our ecosystem but not in package list
        if (dep.startsWith('@designerpunk/') && !packageNames.has(dep)) {
          conflicts.push({
            package: pkg.name,
            conflictType: 'missing',
            description: `${pkg.name} depends on ${dep}, which is not in the package list`,
            affectedPackages: [pkg.name, dep],
            suggestedResolution: `Add ${dep} to the package coordination list`
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Determine resolution strategy for a conflict
   */
  private determineResolutionStrategy(
    conflict: VersionConflict,
    packages: PackageVersion[]
  ): ConflictResolution {
    const suggestedActions: string[] = [];

    switch (conflict.conflictType) {
      case 'circular':
        return {
          conflict,
          strategy: 'manual',
          suggestedActions: [
            'Review package architecture',
            'Consider extracting shared code to a separate package',
            'Remove circular dependency by restructuring imports'
          ]
        };

      case 'incompatible':
        suggestedActions.push(
          `Update ${conflict.package} dependencies to match new versions`,
          'Consider using version ranges (^) for more flexibility',
          'Review breaking changes in updated packages'
        );
        return {
          conflict,
          strategy: 'update-dependent',
          suggestedActions
        };

      case 'missing':
        suggestedActions.push(
          `Add ${conflict.affectedPackages[1]} to package coordination`,
          'Verify package exists in the ecosystem',
          'Update package.json if dependency is incorrect'
        );
        return {
          conflict,
          strategy: 'manual',
          suggestedActions
        };

      default:
        return {
          conflict,
          strategy: 'manual',
          suggestedActions: ['Review conflict manually']
        };
    }
  }

  /**
   * Validate package dependencies against version map
   */
  private validatePackageDependencies(
    pkg: PackageVersion,
    versionMap: Map<string, string>
  ): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];

    if (pkg.dependencies) {
      for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
        const actualVersion = versionMap.get(depName);
        if (actualVersion && !this.isVersionCompatible(depVersion, actualVersion)) {
          issues.push({
            severity: 'error',
            package: pkg.name,
            dependency: depName,
            description: `${pkg.name} requires ${depName}@${depVersion}, but ${actualVersion} is available`,
            suggestedFix: `Update ${pkg.name} to require ${depName}@^${actualVersion}`
          });
        }
      }
    }

    return issues;
  }

  /**
   * Check for package warnings
   */
  private checkPackageWarnings(
    pkg: PackageVersion,
    allPackages: PackageVersion[]
  ): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];
    const packageNames = new Set(allPackages.map(p => p.name));

    // Check for missing DesignerPunk dependencies
    const allDeps = this.getAllDependencies(pkg);
    for (const dep of allDeps) {
      if (dep.startsWith('@designerpunk/') && !packageNames.has(dep)) {
        warnings.push({
          package: pkg.name,
          message: `Dependency ${dep} not found in package list`,
          recommendation: 'Verify that all DesignerPunk packages are included in coordination'
        });
      }
    }

    return warnings;
  }

  /**
   * Check if version satisfies requirement
   */
  private isVersionCompatible(requirement: string, version: string): boolean {
    try {
      return semver.satisfies(version, requirement);
    } catch {
      return false;
    }
  }
}
