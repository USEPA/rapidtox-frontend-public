import {useSessionStore} from '~/stores/session/session';

// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware((to) => {
  const {sessionId} = useSessionStore();
  if ((to.fullPath.includes('human-health-assessment') || to.fullPath.includes('emergency-response')) && !sessionId && import.meta.client) {
    return navigateTo('/');
  }
});
