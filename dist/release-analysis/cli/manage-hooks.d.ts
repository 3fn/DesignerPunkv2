#!/usr/bin/env node
/**
 * Hook Management CLI
 *
 * Command-line interface for installing, uninstalling, and validating
 * release analysis hooks.
 */
interface ManageHooksOptions {
    action: 'install' | 'uninstall' | 'validate' | 'status';
    hookType?: 'git' | 'agent' | 'both';
    quickMode?: boolean;
    timeout?: number;
    failSilently?: boolean;
    cacheResults?: boolean;
}
declare function manageHooks(options: ManageHooksOptions): Promise<void>;
export { manageHooks, ManageHooksOptions };
//# sourceMappingURL=manage-hooks.d.ts.map