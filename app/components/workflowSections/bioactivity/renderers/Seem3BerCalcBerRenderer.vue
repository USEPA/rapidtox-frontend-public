<template>
  <Suspense>
    {{ ber }}
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams<BerCalcRow>;
}>();

const ber = ref('');

onMounted(() => {
  ber.value = props.params.value ? props.params.value.toExponential(2) : '';

  useOn('update-seem3-ber-value', (params) => {
    if (params.rowData.dtxsid === props.params.data?.dtxsid && params.rowData.uniqueId === props.params.data.uniqueId) {
      ber.value = params.ber.toExponential(2);
    }
  });
});
</script>

<style scoped>

</style>
