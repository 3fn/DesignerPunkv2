"use strict";
/**
 * Tests for IRegistry interface
 *
 * These tests verify that the IRegistry interface can be properly implemented
 * and that implementations follow the expected contract.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Mock registry implementation for testing
class MockRegistry {
    constructor() {
        this.name = 'MockRegistry';
        this.tokens = new Map();
    }
    register(token, options) {
        this.tokens.set(token.name, token);
    }
    query() {
        return Array.from(this.tokens.values());
    }
    get(name) {
        return this.tokens.get(name);
    }
    has(name) {
        return this.tokens.has(name);
    }
    // Helper method for testing
    clear() {
        this.tokens.clear();
    }
}
describe('IRegistry Interface', () => {
    let registry;
    beforeEach(() => {
        registry = new MockRegistry();
    });
    describe('Interface Contract', () => {
        it('should have a name property', () => {
            expect(registry.name).toBe('MockRegistry');
            expect(typeof registry.name).toBe('string');
        });
        it('should implement register method', () => {
            expect(typeof registry.register).toBe('function');
        });
        it('should implement query method', () => {
            expect(typeof registry.query).toBe('function');
        });
        it('should implement get method', () => {
            expect(typeof registry.get).toBe('function');
        });
        it('should implement has method', () => {
            expect(typeof registry.has).toBe('function');
        });
    });
    describe('register()', () => {
        it('should register a token', () => {
            const token = { name: 'test', value: 100 };
            registry.register(token);
            expect(registry.has('test')).toBe(true);
        });
        it('should accept registration options', () => {
            const token = { name: 'test', value: 100 };
            const options = { skipValidation: true };
            // Should not throw
            expect(() => registry.register(token, options)).not.toThrow();
        });
        it('should register multiple tokens', () => {
            const token1 = { name: 'token1', value: 100 };
            const token2 = { name: 'token2', value: 200 };
            registry.register(token1);
            registry.register(token2);
            expect(registry.has('token1')).toBe(true);
            expect(registry.has('token2')).toBe(true);
        });
    });
    describe('query()', () => {
        it('should return empty array when no tokens registered', () => {
            const tokens = registry.query();
            expect(Array.isArray(tokens)).toBe(true);
            expect(tokens.length).toBe(0);
        });
        it('should return all registered tokens', () => {
            const token1 = { name: 'token1', value: 100 };
            const token2 = { name: 'token2', value: 200 };
            registry.register(token1);
            registry.register(token2);
            const tokens = registry.query();
            expect(tokens.length).toBe(2);
            expect(tokens).toContainEqual(token1);
            expect(tokens).toContainEqual(token2);
        });
    });
    describe('get()', () => {
        it('should return undefined for non-existent token', () => {
            const token = registry.get('nonexistent');
            expect(token).toBeUndefined();
        });
        it('should return token when it exists', () => {
            const mockToken = { name: 'test', value: 100 };
            registry.register(mockToken);
            const token = registry.get('test');
            expect(token).toBeDefined();
            expect(token).toEqual(mockToken);
        });
        it('should return correct token by name', () => {
            const token1 = { name: 'token1', value: 100 };
            const token2 = { name: 'token2', value: 200 };
            registry.register(token1);
            registry.register(token2);
            const retrieved = registry.get('token2');
            expect(retrieved).toEqual(token2);
            expect(retrieved?.value).toBe(200);
        });
    });
    describe('has()', () => {
        it('should return false for non-existent token', () => {
            expect(registry.has('nonexistent')).toBe(false);
        });
        it('should return true for registered token', () => {
            const token = { name: 'test', value: 100 };
            registry.register(token);
            expect(registry.has('test')).toBe(true);
        });
        it('should return false after clearing registry', () => {
            const token = { name: 'test', value: 100 };
            registry.register(token);
            registry.clear();
            expect(registry.has('test')).toBe(false);
        });
    });
    describe('RegistrationOptions', () => {
        it('should accept skipValidation option', () => {
            const token = { name: 'test', value: 100 };
            const options = { skipValidation: true };
            expect(() => registry.register(token, options)).not.toThrow();
        });
        it('should work without options', () => {
            const token = { name: 'test', value: 100 };
            expect(() => registry.register(token)).not.toThrow();
        });
        it('should work with empty options object', () => {
            const token = { name: 'test', value: 100 };
            const options = {};
            expect(() => registry.register(token, options)).not.toThrow();
        });
    });
    describe('Polymorphic Usage', () => {
        it('should work through IRegistry interface', () => {
            const registryInterface = registry;
            const token = { name: 'test', value: 100 };
            registryInterface.register(token);
            expect(registryInterface.has('test')).toBe(true);
            expect(registryInterface.get('test')).toEqual(token);
            expect(registryInterface.query()).toContainEqual(token);
        });
        it('should support different token types', () => {
            class DifferentRegistry {
                constructor() {
                    this.name = 'DifferentRegistry';
                    this.tokens = new Map();
                }
                register(token) {
                    this.tokens.set(token.name, token);
                }
                query() {
                    return Array.from(this.tokens.values());
                }
                get(name) {
                    return this.tokens.get(name);
                }
                has(name) {
                    return this.tokens.has(name);
                }
            }
            const differentRegistry = new DifferentRegistry();
            const token = { name: 'test', data: 'value' };
            differentRegistry.register(token);
            expect(differentRegistry.has('test')).toBe(true);
        });
    });
});
//# sourceMappingURL=IRegistry.test.js.map