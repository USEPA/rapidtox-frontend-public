<script setup lang="ts">
const {
  user: currentUser, currentProvider,
} = useOidcAuth();
const {APPLICATION_ROUTER_BASE} = useRuntimeConfig().public;
const logoutPath = `${APPLICATION_ROUTER_BASE}auth/logout`;
const currentUserName = currentUser?.value?.claims?.email as string;
const baseStore = useAppBaseStore();
const {$patch: basePatch} = baseStore;
const {showEpaHeaderFooter} = storeToRefs(useAppBaseStore());
// eslint-disable-next-line no-shadow
const setEpaHeaderFooter = (showEpaHeaderFooter: boolean) => basePatch({showEpaHeaderFooter});
const toggleEpaHeaderFooter = () => {
  setEpaHeaderFooter(!showEpaHeaderFooter.value);
};
</script>

<template>
  <section
    id="userInfo"
    class="container d-flex justify-content-end"
    data-cy="navUserInfo"
  >
    <span>Welcome {{ currentUserName }} !</span>
    <a
      :href="logoutPath"
      alt="logout link"
      style="color: white;"
    >
      <v-btn
        data-cy="LogoutButton"
        style="margin-top: 2px !important;font-size: 18px !important;"
        title="Click here to logout"
        aria-label="logout"
      >
        <nuxt-icon
          name="b/box-arrow-right"
          alt="logout icon"
          aria-hidden="true"
          class="mr-2 new-session-icon"
        />
      </v-btn>
    </a>
    <v-btn
      ref="header-footer-nav"
      data-cy="epaHeaderFooterToggleNavItem"
      title="Show/Hide EPA Header & Footer"
      aria-label="Show/Hide EPA Header & Footer"
      @click="toggleEpaHeaderFooter"
    >
      <nuxt-icon
        v-if="showEpaHeaderFooter"
        name="b/arrows-angle-contract"
        alt="Contract headers icon"
        aria-hidden="true"
        class="mr-2 new-session-icon"
      />
      <nuxt-icon
        v-else
        name="b/arrows-angle-expand"
        alt="Expand headers icon"
        aria-hidden="true"
        class="mr-2 new-session-icon"
      />
    </v-btn>
  </section>
</template>
