import * as Sentry from '@sentry/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const {public: {sentry}} = useRuntimeConfig();
  const config = useRuntimeConfig();

  if (!sentry.dsn) {
    return;
  }

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: config.public.SENTRY_DSN_PUBLIC,
    environment: config.public.APPLICATION_ENVIRONMENT_LABEL,
    integrations: [
      Sentry.browserTracingIntegration({router}),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Configure this whole part as you need it!

    tracesSampleRate: parseFloat(config.public.SENTRY_TRACES_SAMPLE_RATE), // Change in prod

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost:*', '/https://ccte-rapidtox-dev.epa.gov/'],

    replaysSessionSampleRate: parseFloat(config.public.SENTRY_SESSION_SAMPLE_RATE), // Change in prod
    replaysOnErrorSampleRate: parseFloat(config.public.SENTRY_ERROR_SAMPLE_RATE), // Change in prod if necessary
  });
  // eslint-disable-next-line consistent-return
  return {
    provide: {
      sentry: Sentry,
    },
  };
});
