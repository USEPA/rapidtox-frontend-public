<template>
  <section>
    <v-btn
      v-if="!isReleaseNotes && !inWorkflow"
      tabindex="0"
      aria-label="release notes link"
      data-cy="ReleaseNotesNavItem"
      to="/release"
      class="homeNavLink"
      @shortkey="goToRelease"
    >
      <nuxt-icon
        name="b/card-list"
        alt="release notes icon"
        aria-hidden="true"
        class="mr-2 new-session-icon"
      /> Release Notes
    </v-btn>
  </section>
</template>

<script setup lang="ts">
const {inWorkflow, isReleaseNotes} = useLocation();

const goToRelease = () => {
  navigateTo('/release');
};
</script>
