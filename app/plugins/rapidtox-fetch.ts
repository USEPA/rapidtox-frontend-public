import type {FetchOptions} from 'ofetch';

export default defineNuxtPlugin({
  name: 'fetch',
  setup() {
    const apiFetch = (fetchOptions: FetchOptions) => {
      const fetchInstance = $fetch.create({
        ...fetchOptions,
        onRequestError(ctx) {
          // Sentry error logging goes here

          if (fetchOptions.onRequestError) {
            fetchOptions.onRequestError(ctx);
          }
        },
        onResponseError(ctx) {
          // Sentry error logging goes here

          if (fetchOptions.onResponseError) {
            fetchOptions.onResponseError(ctx);
          }
        },
      });
      return fetchInstance;
    };

    return {
      provide: {apiFetch},
    };
  },
});
