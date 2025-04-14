import {afterEach, vi} from 'vitest';
import '@testing-library/jest-dom/vitest';
import {mockNuxtImport} from '@nuxt/test-utils/runtime';
import {cleanup} from '@testing-library/vue';

// Mocks to allow tests to run without hanging or erroring out
mockNuxtImport('useOidcAuth', () => () => ({
  loggedIn: vi.fn(),
  login: vi.fn(),
}));

// Run cleanup after each test
afterEach(() => {
  cleanup();
});
