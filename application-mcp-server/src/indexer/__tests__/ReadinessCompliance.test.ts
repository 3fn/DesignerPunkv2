/**
 * ReadinessCompliance — Per-platform readiness derivation compliance test.
 *
 * Validates that the indexer's derived per-platform readiness status matches
 * actual filesystem artifact presence for every component × platform combination.
 *
 * Requirements:
 * - Req 5 AC 1: Derived status matches filesystem artifacts for every component
 * - Req 5 AC 2: Runs as part of standard test suite
 * - Req 5 AC 3: Fails when impl exists but status is not-started
 * - Req 5 AC 4: Fails when not-applicable marker exists but status is not-started
 *
 * @see .kiro/specs/086-component-meta-extraction-pipeline/design.md § Decision 4
 * @see .kiro/specs/086-component-meta-extraction-pipeline/requirements.md § Requirement 5
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { ComponentIndexer } from '../ComponentIndexer';
import type { PlatformReadinessStatus } from '../../models';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

interface SchemaReadinessEntry {
  reviewed?: boolean;
  status?: string;
  reason?: string;
}

interface PlatformArtifacts {
  hasImpl: boolean;
  hasTests: boolean;
}

const PLATFORMS = [
  { key: 'web' as const, implPattern: /\.web\.ts$/, testPatterns: [/\.test\.ts$/] },
  { key: 'ios' as const, implPattern: /\.ios\.swift$/, testPatterns: [/Tests\.swift$/] },
  { key: 'android' as const, implPattern: /\.android\.kt$/, testPatterns: [/Test\.kt$/] },
];

function scanBaseline(componentDir: string): boolean {
  const hasSchema = fs.readdirSync(componentDir).some(f => f.endsWith('.schema.yaml'));
  const hasContracts = fs.existsSync(path.join(componentDir, 'contracts.yaml'));
  const hasTypes = fs.existsSync(path.join(componentDir, 'types.ts'));
  return hasSchema && hasContracts && hasTypes;
}

function scanPlatformArtifacts(componentDir: string, platform: typeof PLATFORMS[number]): PlatformArtifacts {
  const platformDir = path.join(componentDir, 'platforms', platform.key);
  const hasImpl = fs.existsSync(platformDir) &&
    fs.readdirSync(platformDir).some(f => platform.implPattern.test(f));

  const testsDir = path.join(componentDir, '__tests__');
  const hasTests = (
    (fs.existsSync(platformDir) && fs.readdirSync(platformDir).some(f => platform.testPatterns.some(tp => tp.test(f)))) ||
    (fs.existsSync(testsDir) && fs.readdirSync(testsDir).some(f => platform.testPatterns.some(tp => tp.test(f))))
  );

  return { hasImpl, hasTests };
}

function readSchemaReadiness(componentDir: string): Record<string, SchemaReadinessEntry> | string | null {
  const schemaFile = fs.readdirSync(componentDir).find(f => f.endsWith('.schema.yaml'));
  if (!schemaFile) return null;
  const raw = yaml.load(fs.readFileSync(path.join(componentDir, schemaFile), 'utf-8')) as Record<string, unknown>;
  const r = raw?.readiness;
  if (r == null) return null;
  if (typeof r === 'string') return r;
  return r as Record<string, SchemaReadinessEntry>;
}

function expectedStatus(
  baselineComplete: boolean,
  artifacts: PlatformArtifacts,
  reviewed: boolean,
  notApplicable: boolean,
): PlatformReadinessStatus['status'] {
  if (notApplicable) return 'not-applicable';
  if (!artifacts.hasImpl) return 'not-started';
  if (!baselineComplete || !artifacts.hasTests) return 'scaffold';
  if (!reviewed) return 'development';
  return 'production-ready';
}

describe('ReadinessCompliance', () => {
  let indexer: ComponentIndexer;

  beforeAll(async () => {
    indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
  });

  it('derived per-platform status matches filesystem artifacts for every component', () => {
    const catalog = indexer.getCatalog();
    const mismatches: string[] = [];

    for (const entry of catalog) {
      const componentDir = path.join(COMPONENTS_DIR, entry.name);
      if (!fs.existsSync(componentDir)) continue;

      const baselineComplete = scanBaseline(componentDir);
      const schemaReadiness = readSchemaReadiness(componentDir);

      for (const platform of PLATFORMS) {
        const artifacts = scanPlatformArtifacts(componentDir, platform);

        const reviewed = typeof schemaReadiness === 'object' && schemaReadiness !== null
          ? schemaReadiness[platform.key]?.reviewed === true
          : false;
        const notApplicable = typeof schemaReadiness === 'object' && schemaReadiness !== null
          ? schemaReadiness[platform.key]?.status === 'not-applicable'
          : false;

        const expected = expectedStatus(baselineComplete, artifacts, reviewed, notApplicable);
        const actual = entry.readiness[platform.key].status;

        if (actual !== expected) {
          mismatches.push(
            `${entry.name} [${platform.key}]: expected '${expected}' but got '${actual}'` +
            ` (baseline=${baselineComplete}, impl=${artifacts.hasImpl}, tests=${artifacts.hasTests}, reviewed=${reviewed})`
          );
        }
      }
    }

    expect(mismatches).toEqual([]);
  });

  it('no component with a platform implementation file has not-started status', () => {
    const catalog = indexer.getCatalog();
    const violations: string[] = [];

    for (const entry of catalog) {
      const componentDir = path.join(COMPONENTS_DIR, entry.name);
      if (!fs.existsSync(componentDir)) continue;

      for (const platform of PLATFORMS) {
        const { hasImpl } = scanPlatformArtifacts(componentDir, platform);
        if (hasImpl && entry.readiness[platform.key].status === 'not-started') {
          violations.push(`${entry.name} [${platform.key}]: has implementation file but status is 'not-started'`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('no component with a not-applicable marker has not-started status', () => {
    const catalog = indexer.getCatalog();
    const violations: string[] = [];

    for (const entry of catalog) {
      const componentDir = path.join(COMPONENTS_DIR, entry.name);
      if (!fs.existsSync(componentDir)) continue;

      const schemaReadiness = readSchemaReadiness(componentDir);

      for (const platform of PLATFORMS) {
        const notApplicable = typeof schemaReadiness === 'object' && schemaReadiness !== null
          ? schemaReadiness[platform.key]?.status === 'not-applicable'
          : false;

        if (notApplicable && entry.readiness[platform.key].status === 'not-started') {
          violations.push(`${entry.name} [${platform.key}]: has not-applicable marker but status is 'not-started'`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('baseline gate caps platforms at scaffold when component-level artifacts are incomplete', () => {
    const catalog = indexer.getCatalog();
    const violations: string[] = [];

    for (const entry of catalog) {
      const componentDir = path.join(COMPONENTS_DIR, entry.name);
      if (!fs.existsSync(componentDir)) continue;

      const baselineComplete = scanBaseline(componentDir);
      if (baselineComplete) continue; // Only check components with incomplete baselines

      for (const platform of PLATFORMS) {
        const status = entry.readiness[platform.key].status;
        if (status === 'development' || status === 'production-ready') {
          violations.push(
            `${entry.name} [${platform.key}]: status is '${status}' but baseline artifacts are incomplete — should be capped at 'scaffold'`
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('production-ready requires reviewed flag', () => {
    const catalog = indexer.getCatalog();
    const violations: string[] = [];

    for (const entry of catalog) {
      for (const platform of PLATFORMS) {
        const r = entry.readiness[platform.key];
        if (r.status === 'production-ready' && !r.reviewed) {
          violations.push(`${entry.name} [${platform.key}]: status is 'production-ready' but reviewed is false`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
