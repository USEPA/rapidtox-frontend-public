<template>
  <Suspense>
    <div>
      <ConvertDoseDialog
        v-bind="props"
        @show-error="showEr"
      />
      <ConvertDoseErrorSnackbar
        :show-snackbar="isError"
        :unique-id="`${props.params.data?.id}-${props.params.data?.dtxsid}`"
        @update-show-snackbar="updateSnackbarState"
      />
    </div>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import ConvertDoseDialog from '../dialogs/ConvertDoseDialog.vue';
import ConvertDoseErrorSnackbar from '../components/ConvertDoseErrorSnackbar.vue';
import type {PodData} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<PodData>;
}>();

const isError = ref(false);

const updateSnackbarState = (isOpen: boolean) => {
  isError.value = isOpen;
};

const showEr = () => {
  isError.value = true;
};
</script>

<style scoped>

</style>
