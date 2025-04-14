<template>
  <SnackbarToast
    v-model="showError"
    :is-open="props.showSnackbar"
    :content-class="`convert-dose-${props.uniqueId}-err-class`"
    location="top right"
    timeout="5000"
    color="error"
    elevation="24"
    variant="elevated"
    max-width="400"
    min-width="300"
    position="relative"
    attach="body"
    @update-open="updateSnackbarState"
  >
    Error saving dose conversion.
    <template #actions>
      <v-btn
        color="white"
        variant="outlined"
        @click="updateSnackbarState(false)"
      >
        Close
      </v-btn>
    </template>
  </SnackbarToast>
</template>

<script setup lang="ts">
import SnackbarToast from '~/components/layout/UI/Snackbars/SnackbarToast.vue';

const props = defineProps<{
  showSnackbar: boolean;
  uniqueId: string;
}>();

const emits = defineEmits<{
  updateShowSnackbar: [boolean];
}>();

const showError = computed({
  get() {
    return props.showSnackbar;
  },
  set(val: boolean) {
    emits('updateShowSnackbar', val);
  },

});

const updateSnackbarState = (isOpen: boolean) => {
  showError.value = isOpen;
};
</script>

<style scoped>

</style>
