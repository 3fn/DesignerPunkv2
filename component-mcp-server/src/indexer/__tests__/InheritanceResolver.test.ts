/**
 * InheritanceResolver Unit Tests
 */

import * as path from 'path';
import { resolveInheritance, validateOmits } from '../InheritanceResolver';
import { parseContractsYaml, ParsedContracts } from '../parsers';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

// Helper to load real contracts
function loadContracts(component: string): ParsedContracts {
  const result = parseContractsYaml(path.join(COMPONENTS_DIR, component, 'contracts.yaml'));
  return result.data!;
}

describe('resolveInheritance', () => {
  it('merges parent contracts into child (Badge-Count-Notification inherits Badge-Count-Base)', () => {
    const child = loadContracts('Badge-Count-Notification');
    const parent = loadContracts('Badge-Count-Base');
    const result = resolveInheritance(child, parent);

    expect(result.warnings).toHaveLength(0);

    const { contracts } = result;
    expect(contracts.inheritsFrom).toBe('Badge-Count-Base');

    // Child's own contracts present
    expect(contracts.active.visual_notification_color).toBeDefined();
    expect(contracts.active.visual_notification_color.source).toBe('own');

    // Parent contracts inherited
    expect(contracts.active.content_displays_count).toBeDefined();
    expect(contracts.active.content_displays_count.source).toBe('inherited');

    // Excluded contracts not in active
    expect(contracts.active.interaction_focusable).toBeUndefined();
    expect(contracts.excluded.interaction_focusable).toBeDefined();

    // Own and inherited lists populated
    expect(contracts.own).toContain('visual_notification_color');
    expect(contracts.inherited).toContain('content_displays_count');
  });

  it('child extension overrides parent contract (source = extended)', () => {
    // Simulate: parent has contract_a, child also has contract_a
    const parent: ParsedContracts = {
      version: '1.0.0', component: 'Parent', family: 'Test', inherits: null,
      contracts: {
        shared_contract: { category: 'visual', description: 'parent version', behavior: 'parent behavior', wcag: null, platforms: ['web'], validation: [], required: true },
      },
      excludes: {},
    };
    const child: ParsedContracts = {
      version: '1.0.0', component: 'Child', family: 'Test', inherits: 'Parent',
      contracts: {
        shared_contract: { category: 'visual', description: 'child version', behavior: 'child behavior', wcag: null, platforms: ['web'], validation: [], required: true },
      },
      excludes: {},
    };

    const result = resolveInheritance(child, parent);
    expect(result.contracts.active.shared_contract.source).toBe('extended');
    expect(result.contracts.active.shared_contract.behavior).toBe('child behavior');
    expect(result.contracts.own).toContain('shared_contract');
    expect(result.contracts.inherited).not.toContain('shared_contract');
  });

  it('excludes omit parent contracts with rationale preserved', () => {
    const child = loadContracts('Badge-Count-Notification');
    const parent = loadContracts('Badge-Count-Base');
    const result = resolveInheritance(child, parent);

    expect(result.contracts.excluded.interaction_focusable).toBeDefined();
    expect(result.contracts.excluded.interaction_focusable.reason).toBeTruthy();
  });

  it('warns on missing parent', () => {
    const child: ParsedContracts = {
      version: '1.0.0', component: 'Orphan', family: 'Test', inherits: 'MissingParent',
      contracts: { some_contract: { category: 'visual', description: 'test', behavior: 'test', wcag: null, platforms: ['web'], validation: [], required: true } },
      excludes: {},
    };

    const result = resolveInheritance(child, null);
    expect(result.warnings).toEqual(expect.arrayContaining([expect.stringContaining('Unresolved inheritance')]));
    // Still returns child's own contracts
    expect(result.contracts.active.some_contract).toBeDefined();
    expect(result.contracts.inheritsFrom).toBe('MissingParent');
  });

  it('warns on grandchild depth violation', () => {
    const child = loadContracts('Badge-Count-Notification');
    const parent = loadContracts('Badge-Count-Base');
    const result = resolveInheritance(child, parent, true);

    expect(result.warnings).toEqual(expect.arrayContaining([expect.stringContaining('Grandchild inheritance detected')]));
    // Still resolves — warning only
    expect(Object.keys(result.contracts.active).length).toBeGreaterThan(0);
  });

  it('returns all own when no inheritance', () => {
    const standalone = loadContracts('Badge-Count-Base');
    const result = resolveInheritance(standalone, null);

    expect(result.warnings).toHaveLength(0);
    expect(result.contracts.inheritsFrom).toBeNull();
    expect(result.contracts.inherited).toHaveLength(0);
    expect(result.contracts.own.length).toBe(Object.keys(standalone.contracts).length);
  });
});

describe('validateOmits', () => {
  const parentProps = { size: {}, indeterminate: {}, labelAlign: {}, checked: {} };

  it('returns valid omits when props exist on parent', () => {
    const result = validateOmits('Child', ['size', 'indeterminate'], 'Parent', parentProps);
    expect(result.valid).toEqual(['size', 'indeterminate']);
    expect(result.warnings).toHaveLength(0);
  });

  it('warns when omitted prop not found on parent', () => {
    const result = validateOmits('Child', ['size', 'nonexistent'], 'Parent', parentProps);
    expect(result.valid).toEqual(['size']);
    expect(result.warnings).toEqual(["Omit 'nonexistent' not found on parent Parent"]);
  });

  it('warns when omits declared but no parent', () => {
    const result = validateOmits('Child', ['size'], null, null);
    expect(result.warnings).toEqual(['Child declares omits but has no parent']);
    expect(result.valid).toHaveLength(0);
  });

  it('returns empty for no omits', () => {
    const result = validateOmits('Child', [], 'Parent', parentProps);
    expect(result.valid).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('warns when parent not indexed but preserves omits', () => {
    const result = validateOmits('Child', ['size'], 'Parent', null);
    expect(result.valid).toEqual(['size']);
    expect(result.warnings).toEqual(['Cannot validate omits for Child: parent Parent not indexed']);
  });
});
