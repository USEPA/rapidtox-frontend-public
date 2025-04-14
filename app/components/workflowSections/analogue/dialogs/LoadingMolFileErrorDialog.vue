<template>
  <v-dialog
    v-model="showDialog"
    aria-label="Error Loading Mol File"
    max-width="500"
    role="alert"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 bg-danger`"
        aria-label="Error Loading Mol File Header"
        dark
      >
        Error Loading Mol File
        <v-spacer />
        <v-btn
          @click="showDialog = false"
        >
          <nuxt-icon
            class="min-nuxt-icon text-white"
            alt="Close"
            aria-label="Close"
            name="mdi/close"
          />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        {{ props.errorMessage }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          text="Close"
          variant="flat"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  errorMessage: string;
}>();

const emits = defineEmits<{
  closeErrorDialog: [];
}>();

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeErrorDialog');
  },
});
</script>

<style scoped>

</style>
