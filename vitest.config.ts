import {defineVitestConfig} from '@nuxt/test-utils/config';
import {loadEnv} from "vite";
import {configDefaults} from "vitest/config";

export default defineVitestConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reportsDirectory: '../test/vitest/coverage',
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
      exclude: [
          ...configDefaults.exclude, 
          '**/node_modules/',
          'nuxt/',
          'assets/',
          'app.vue', 'plugins/', 'test/', '**/*.spec.ts',
          '**/*ColumnDefs.ts',
          '**/*{c,C}onstants.ts',
          '**/stores/settings.ts',
          '**/composables/*.ts',
          '**/*GridOptions.ts',
      ],
      include: [
        '**/*.ts',
        '**/*.vue',
      ],
    },
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
        dotenv: {
          fileName: '.env'
        }
      },
    },
    env: loadEnv('development',process.cwd(),''),
    globals: true,
    testTimeout: 3500,
    setupFiles: ['./test/vitest/vitest-setup.ts'],
    // remove Suspense message from console
    onConsoleLog(log) {
      if (log.includes('<Suspense> is an experimental feature and its API will likely change.')) {
        return false
      }
    }
  },
});
