/**
 * ContractTokenDeriver Unit Tests
 */

import { deriveContractTokenRelationships } from '../ContractTokenDeriver';
import { ResolvedContracts, Contract } from '../../models';

function makeContracts(entries: Record<string, Partial<Contract>>): ResolvedContracts {
  const active: Record<string, Contract> = {};
  for (const [name, partial] of Object.entries(entries)) {
    active[name] = {
      category: partial.category ?? 'accessibility',
      description: partial.description ?? '',
      behavior: partial.behavior ?? '',
      wcag: partial.wcag ?? null,
      platforms: partial.platforms ?? ['web'],
      validation: partial.validation ?? [],
      required: partial.required ?? true,
      source: partial.source ?? 'own',
    };
  }
  return { inheritsFrom: null, active, excluded: {}, own: Object.keys(active), inherited: [] };
}

describe('deriveContractTokenRelationships', () => {
  it('resolves token found in both contract prose and schema tokens list', () => {
    const contracts = makeContracts({
      accessibility_contrast: {
        category: 'accessibility',
        behavior: 'Icon color uses color.avatar.human.icon token for contrast.',
      },
    });
    const result = deriveContractTokenRelationships(contracts, ['color.avatar.human.icon']);
    expect(result.resolved).toEqual([
      { contract: 'accessibility_contrast', token: 'color.avatar.human.icon', category: 'accessibility' },
    ]);
    expect(result.gaps).toHaveLength(0);
  });

  it('reports gap when token in prose is not in schema tokens list', () => {
    const contracts = makeContracts({
      accessibility_contrast: {
        category: 'accessibility',
        behavior: 'Uses color.missing.token for something.',
      },
    });
    const result = deriveContractTokenRelationships(contracts, ['color.other.token']);
    expect(result.gaps).toEqual([
      { contract: 'accessibility_contrast', referencedToken: 'color.missing.token', category: 'accessibility' },
    ]);
    expect(result.resolved).toHaveLength(0);
  });

  it('skips non-accessibility/animation categories', () => {
    const contracts = makeContracts({
      visual_color: {
        category: 'visual',
        behavior: 'Uses color.surface.primary for background.',
      },
      interaction_hover: {
        category: 'interaction',
        behavior: 'Uses motion.focusTransition for hover.',
      },
    });
    const result = deriveContractTokenRelationships(contracts, ['color.surface.primary', 'motion.focusTransition']);
    expect(result.resolved).toHaveLength(0);
    expect(result.gaps).toHaveLength(0);
  });

  it('extracts primitive token names (duration150, easingStandard)', () => {
    const contracts = makeContracts({
      animation_transition: {
        category: 'animation',
        behavior: 'Uses duration150 and easingStandard for transition.',
      },
    });
    const result = deriveContractTokenRelationships(contracts, ['duration150']);
    expect(result.resolved).toEqual([
      { contract: 'animation_transition', token: 'duration150', category: 'animation' },
    ]);
    // easingStandard not in schema tokens → gap
    expect(result.gaps).toEqual(
      expect.arrayContaining([expect.objectContaining({ referencedToken: 'easingStandard' })]),
    );
  });

  it('flags stale motion.duration.X naming', () => {
    const contracts = makeContracts({
      accessibility_motion: {
        category: 'accessibility',
        behavior: 'Transition uses motion.duration.fast token.',
      },
    });
    const result = deriveContractTokenRelationships(contracts, []);
    expect(result.gaps).toEqual(
      expect.arrayContaining([expect.objectContaining({ referencedToken: expect.stringContaining('Stale motion token naming') })]),
    );
  });

  it('handles contracts with no token references', () => {
    const contracts = makeContracts({
      accessibility_label: {
        category: 'accessibility',
        behavior: 'Provides accessible name via aria-label attribute.',
      },
    });
    const result = deriveContractTokenRelationships(contracts, ['color.text.default']);
    expect(result.resolved).toHaveLength(0);
    expect(result.gaps).toHaveLength(0);
  });
});
