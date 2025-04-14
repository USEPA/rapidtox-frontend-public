<script setup lang="ts">
const {APPLICATION_ROUTER_BASE} = useRuntimeConfig().public;
const redirectPath = `${APPLICATION_ROUTER_BASE}auth/login`;
const oidc = useCookie('nuxt-oidc-auth');
oidc.value = null;
onMounted(() => {
  sessionStorage.removeItem('session');
  setTimeout(() => {
    window.location.href = redirectPath;
  }, 1000);
});
</script>

<template>
  <NuxtLayout name="default">
    <main
      id="main"
      class="container-fluid main-content px-0"
    >
      <div class="container-fluid app-container">
        <div class="row justify-content-center">
          <div class="col">
            <h1 class="page-title">
              Goodbye
            </h1>
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>
