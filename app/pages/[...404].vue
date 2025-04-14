<script setup lang="ts">
const router = useRoute();
const {
  user, loggedIn,
} = useOidcAuth();
const sentryMsg = ref('');
sentryMsg.value = `User requested nonexistent route ${router.fullPath}`;
const {$sentry} = useNuxtApp();
$sentry.captureMessage(sentryMsg.value);
if (loggedIn) {
  navigateTo('/index');
}
if (!loggedIn) {
  navigateTo('/auth/login');
}
</script>

<template>
  <NuxtLayout name="epa">
    <div>
      <h2>Error page</h2>
    </div>
  </NuxtLayout>
</template>
