/**
 * FileWatcher Integration Tests
 */

import * as fs from 'fs';
import * as path from 'path';
import { ComponentIndexer } from '../../indexer/ComponentIndexer';
import { FileWatcher } from '../FileWatcher';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

describe('FileWatcher', () => {
  let indexer: ComponentIndexer;
  let watcher: FileWatcher;

  beforeAll(async () => {
    indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
  });

  afterEach(() => {
    watcher?.stop();
  });

  it('starts and stops without error', () => {
    watcher = new FileWatcher(indexer, COMPONENTS_DIR, 50);
    watcher.start();
    expect(watcher.isWatching()).toBe(true);
    watcher.stop();
    expect(watcher.isWatching()).toBe(false);
  });

  it('throws on nonexistent directory', () => {
    watcher = new FileWatcher(indexer, '/nonexistent/path');
    expect(() => watcher.start()).toThrow('not found');
  });

  it('re-indexes on file touch', async () => {
    watcher = new FileWatcher(indexer, COMPONENTS_DIR, 50);
    watcher.start();

    const before = indexer.getComponent('Badge-Count-Base');
    const beforeTime = before!.indexedAt;

    // Touch the contracts.yaml to trigger a change event
    const contractsPath = path.join(COMPONENTS_DIR, 'Badge-Count-Base', 'contracts.yaml');
    const content = fs.readFileSync(contractsPath, 'utf-8');
    fs.writeFileSync(contractsPath, content); // write same content = touch

    // Wait for debounce + reindex
    await new Promise(r => setTimeout(r, 300));

    const after = indexer.getComponent('Badge-Count-Base');
    expect(after).not.toBeNull();
    expect(after!.indexedAt).not.toBe(beforeTime);
  });
});
