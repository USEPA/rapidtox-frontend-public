import {sentryVitePlugin} from '@sentry/vite-plugin';
import { fileURLToPath } from 'node:url';

// This env variable gets overwritten during deployments. Currently they are 'CCTE-DEV', 'CCTE-STAGING', & 'CCTE-PRODUCTION'.
const isDeployedEnv = process.env.APPLICATION_ENVIRONMENT_LABEL?.toLowerCase().trim().startsWith('ccte-');

// nuxt-oidc-auth's Dev Mode to bypass login (for testing env) - https://nuxtoidc.cloud/dev-mode
const isDevMode = process.env.ENABLE_DEV_MODE === 'TRUE';

export default defineNuxtConfig({
  extends: ['@usepa/ccte-epa-header-footer'],
  app: {
    baseURL: process.env.APPLICATION_ROUTER_BASE,
  },
  devServer: {
    port: Number.parseInt(<string>process.env.NUXT_APPLICATION_SERVER_PORT, 10),
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    clientNodeCompat: true,
  },
  features: {
    inlineStyles: false,
  },
  // To re-enable _all_ Nuxt v3 behavior, set the following options:
  // srcDir: '.',
  // dir: {
  //   app: 'app'
  // },
  // experimental: {
  //   sharedPrerenderData: false,
  //   compileTemplate: true,
  //   resetAsyncDataToUndefined: true,
  //   templateUtils: true,
  //   relativeWatchPaths: true,
  //   defaults: {
  //     useAsyncData: {
  //       deep: true
  //     }
  //   }
  // },
  // unhead: {
  //   renderSSRHeadOptions: {
  //     omitLineBreaks: false
  //   }
  // },
  alias: {
    "~": fileURLToPath(new URL('./app', import.meta.url)),
  },
  css: [
    // '@/assets/css/main.css',
    // '@/assets/css/global.module.scss',
    'ag-grid-community/styles/ag-grid.css',
    'ag-grid-community/styles/ag-theme-balham.css',
    '@/assets/styles/custom.scss',
  ],
  ssr: true,
  components: [
    {
      path: './components',
      prefix: 'Grids',
    },
  ],
  hooks: {
    'components:dirs': (dirs) => {
      dirs.push({
        path: '~/components/grids',
        prefix: 'grids',
      });
    },
  },
  imports: {
    dirs: [
      './**/stores/**',
      './components/grids/configs',
      './**/gridConfigs/**',
    ],
  },
  presets: [
    'pinia',
    '@',
  ],
  oidc: {
    defaultProvider: 'oidc',
    providers: {
      oidc: {
        clientId: <string>process.env.NUXT_OIDC_CLIENT_ID,
        clientSecret: <string>process.env.NUXT_OIDC_CLIENT_SECRET,
        authorizationUrl: <string>process.env.NUXT_OIDC_AUTH_URL,
        tokenUrl: <string>process.env.NUXT_OIDC_TOKEN_URL,
        optionalClaims: ['email'],
        scope: ['openid', 'offline_access', <string>process.env.NUXT_OIDC_CLIENT_ID],
        redirectUri: <string>process.env.NUXT_OIDC_REDIRECT_URI,
        exposeAccessToken: true,
        openIdConfiguration: <string>process.env.NUXT_OIDC_OPENID_CONFIG,
      },
    },
    devMode: {
      enabled: isDevMode,
      claims: { 
        email: <string>process.env.DEV_MODE_USERNAME, 
      },
      generateAccessToken: true,
      provider: 'oidc',
    },
    session: {
      expirationCheck: !isDevMode,
      automaticRefresh: true,
      expirationThreshold: 450,
    },
    middleware: {
      globalMiddlewareEnabled: true,
      customLoginPage: true,
      customLogoutPage: true,
    },
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs'],
      },
    ],
    'nuxt-security',
    '@vueuse/nuxt',
    '@formkit/auto-animate/nuxt',
    '@nuxt/eslint',
    'nuxt-oidc-auth',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-icons',
    'vuetify-nuxt-module',
    // 'nuxt-auth-utils',
    '@nuxt/test-utils/module',
  ],
  piniaPersistedstate: {
    storage: 'sessionStorage',
  },
  vuetify: {
    vuetifyOptions: {
      labComponents: ['VNumberInput'],
      theme: {
        themes: {
          primary: {
            colors: {
              $epabluebase: '#005ea2',
              $epabluelight1: '#aacdec',
              $dark: '#212121',
              $theme1: '#33a8d1',
              $green: '#5e9f69',
              $gray100: '#edeff0',
              $gray200: '#dfe1e2',
              $gray300: '#a9aeb1',
              $gray400: '#71767a',
              $gray500: '#565c65',
              $gray600: '#3d4551',
              $gray700: '#1c1d1f',
              $primary: '#005ea2',
              $secondary: '#e52207',
              $success: '#00a91c',
              $info: '#00bde3',
              $warning: '#ffbe2e',
              $ercolor: '#190182',
              $hhacolor: '#0071bc',
            }
          }
        }
      }
    }
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
        indent: 2,
        quotes: 'single',
      },
    },
  },
  security: {
    // This may be needed for new nuxt config updates on crossOriginResourcePolicy & crossOriginEmbedderPolicy
    // corsHandler: {
    //   origin:  ['*.localhost', '*.epa.gov']
    // },
    removeLoggers: isDeployedEnv,
    rateLimiter: false,
    headers: {
      crossOriginResourcePolicy: 'same-site',
      crossOriginOpenerPolicy: 'same-origin-allow-popups',
      xContentTypeOptions: 'nosniff',
      // TODO: remove the unsafe-none in dev when this issue is resolved. https://github.com/nuxt/nuxt/issues/22141
      crossOriginEmbedderPolicy: isDeployedEnv ? 'require-corp' : 'unsafe-none',
      contentSecurityPolicy: {
        'base-uri': ["'none'"],
        'font-src': ['\'self\'', 'https:', 'data:'],
        'script-src': ['\'self\'', 'localhost:*', 'https:', 'data:', '*.epa.gov', '\'unsafe-eval\'', '\'unsafe-inline\''],
        'form-action': ['\'self\'', '*.epa.gov'],
        'frame-ancestors': ['\'self\''],
        'worker-src': ['self', 'blob:'],
        'img-src': ['\'self\'', '*.localhost', 'https:', 'data:', '*.epa.gov'],
        'object-src': ['\'none\''],
        'script-src-attr': ['\'none\''],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'https:'],
        'upgrade-insecure-requests': false,
      },
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true,
      },
    },
  },
  routeRules: {
    '/ketcher/index.html': {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp' 
      }
    },
    '/rapidtox/ketcher/index.html': {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp' 
      }
    }
  },
  devtools: {enabled: true},

  runtimeConfig: {
    public: {
      APPLICATION_BASE_API: process.env.APPLICATION_BASE_API,
      APPLICATION_EXTERNAL_LINK_URL: process.env.APPLICATION_EXTERNAL_LINK_URL,
      APPLICATION_ROUTER_BASE: process.env.APPLICATION_ROUTER_BASE,
      APPLICATION_TITLE: process.env.APPLICATION_TITLE,
      CCD_DASHBOARD_URL: process.env.CCD_DASHBOARD_URL,
      SENTRY_DSN_PUBLIC: process.env.SENTRY_DSN,
      SENTRY_ENABLE_DEBUG: process.env.SENTRY_ENABLE_DEBUG,
      SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
      SENTRY_SESSION_SAMPLE_RATE: process.env.SENTRY_SESSION_SAMPLE_RATE,
      SENTRY_ERROR_SAMPLE_RATE: process.env.SENTRY_ERROR_SAMPLE_RATE,
      APPLICATION_ENVIRONMENT_LABEL: process.env.APPLICATION_ENVIRONMENT_LABEL,
      APPLICATION_REPORT_BASE_API: process.env.APPLICATION_REPORT_BASE_API,
      APPLICATION_CHEMICAL_BASE_API: process.env.APPLICATION_CHEMICAL_BASE_API,
      APPLICATION_PHYSCHEM_BASE_API: process.env.APPLICATION_PHYSCHEM_BASE_API,
      APPLICATION_HAZARD_BASE_API: process.env.APPLICATION_HAZARD_BASE_API,
      APPLICATION_CHEMICAL_ICON_IMAGE_API: process.env.APPLICATION_CHEMICAL_ICON_IMAGE_API,
      APPLICATION_CCD_CHEMICAL_DETAILS: process.env.APPLICATION_CCD_CHEMICAL_DETAILS,
      APPLICATION_CHEMICAL_MOL_FILE_API: process.env.APPLICATION_CHEMICAL_MOL_FILE_API,
      APPLICATION_SAFETY_LINKS_API: process.env.APPLICATION_SAFETY_LINKS_API,
      NUXT_OIDC_CLIENT_SECRET: process.env.NUXT_OIDC_CLIENT_SECRET,
      IS_AXE_ENABLED: process.env.APPLICATION_ENVIRONMENT_LABEL?.toLowerCase().trim().includes('local'),
      sentry: {
        dsn: process.env.SENTRY_DSN,
        environment: process.env.APPLICATION_ENVIRONMENT_LABEL,
      },
    },
  },
  sourcemap: true,
  vite: {
    plugins: [
      // Put the Sentry vite plugin after all other plugins
      sentryVitePlugin({
        url: process.env.SENTRY_DSN?.length > 0 ? 'https://ccte-app-monitoring.epa.gov' : '',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'sentry',
        project: 'rapidtox-frontend',
        telemetry: false,
        errorHandler: (err) => {
          console.warn(err);
        },
      }),
    ],
    optimizeDeps: {
      include: ['axe-core'],
    },
  },

  compatibilityDate: '2024-07-08',
});
