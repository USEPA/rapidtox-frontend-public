<template>
  <section>
    <v-btn
      v-if="!isHome"
      tabindex="0"
      aria-label="home link"
      data-cy="HomeLink"
      style="text-decoration: underline"
      to="/"
    >
      <nuxt-icon
        name="b/house-door"
        aria-hidden="true"
        class="ml-2 new-session-icon"
      />
      Workflows
    </v-btn>
  </section>
</template>

<script setup lang="ts">
const {isHome} = useLocation();
</script>
