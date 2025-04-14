<template>
  <client-only>
    <SnackbarToast
      v-model="showSessionSnackbar"
      :is-open="showSessionSnackbar"
      location="top right"
      timeout="5000"
      color="epa-green-base"
      elevation="24"
      variant="elevated"
      max-width="400"
      :content-class="sessionSnackBarContentClass"
      min-width="300"
      position="relative"
      @update-open="updatedOpen"
    >
      <v-row>
        <v-col sm="12">
          {{ sessionSnackbarMsg }} <nuxt-icon name="b/check2" />
        </v-col>
      </v-row>
      <template #actions>
        <v-btn
          color="white"
          variant="outlined"
          @click="showSessionSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </SnackbarToast>
  </client-only>
</template>

<script setup lang="ts">
import SnackbarToast from '../SnackbarToast.vue';

const sessionStore = useSessionStore();

const {
  showSessionSnackbar, sessionSnackbarMsg, sessionSnackBarContentClass,
} = storeToRefs(sessionStore);

const updatedOpen = (isOpen: boolean) => {
  showSessionSnackbar.value = isOpen;
};
</script>

<style scoped>
</style>
