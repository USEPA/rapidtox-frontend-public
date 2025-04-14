// Skip Husky install in production and CI
if (process.env.NODE_ENV === 'production' || process.env.ENVIRONMENT_NAME === 'production' || process.env.CI === 'true') {
  // eslint-disable-next-line no-process-exit
  process.exit(0);
}
// eslint-disable-next-line no-unused-vars
const husky = (await import('husky')).default;
