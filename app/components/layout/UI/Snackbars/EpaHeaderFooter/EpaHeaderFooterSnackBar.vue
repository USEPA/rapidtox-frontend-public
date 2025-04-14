<template>
  <SnackbarToast
    id="epa-header-footer-snackbar"
    v-model="showEpaHeaderFooterSnackbar"
    :is-open="showEpaHeaderFooterSnackbar"
    location="top right"
    timeout="-1"
    color="epa-info-dark"
    elevation="24"
    variant="elevated"
    max-width="500"
    :content-class="epaHeaderFooterSnackbarContentClass"
    min-width="500"
    @update-open="updatedOpen"
  >
    <v-row>
      <v-col sm="12">
        The EPA's header and footer has been minimized to improve RapidTox's viewing experience. To
        display the EPA's header and footer press the minimize (  <nuxt-icon
          name="b/arrows-angle-expand"
          alt="Expand headers icon"
          aria-hidden="true"
          wid
        /> )
        icon on the navbar above this message.
      </v-col>
    </v-row>
    <template #actions>
      <v-btn
        color="white"
        variant="outlined"
        @click="showEpaHeaderFooterSnackbar = false"
      >
        Close
      </v-btn>
    </template>
  </SnackbarToast>
</template>

<script setup lang="ts">
import SnackbarToast from '../SnackbarToast.vue';

const baseStore = useAppBaseStore();
const {showEpaHeaderFooterSnackbar, epaHeaderFooterSnackbarContentClass} = storeToRefs(baseStore);

const updatedOpen = (isOpen: boolean) => {
  showEpaHeaderFooterSnackbar.value = isOpen;
};
</script>

<style scoped>
:deep(.nuxt-icon svg) {
  width: 20px !important;
  height: 20px !important;
}
</style>
