<template>
  <Suspense>
    <div>
      <v-number-input
        v-model="exposureVal"
        :max="Number.MAX_SAFE_INTEGER"
        :min="0"
        aria-label="Exposure Value"
        tabindex="0"
        @update:model-value="onChange"
      />
    </div>
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

const exposureVal = ref<number | null>(null);

onMounted(() => {
  exposureVal.value = Number(props.params.data?.exposureValue) || null;
});

const onChange = () => {
  useEvent('update-seem3-ber-calc-row', {
    rowData: {
      ...props.params.data as BerCalcRow,
      exposureValue: exposureVal.value as number,
    },
    valueToUpdate: 'exposureValue',
    newVal: exposureVal.value as number,
    rowIndex: props.params.node.rowIndex as number,
  });
};

onMounted(() => {
  nextTick(() => { addAriaLabelToNumberInputs(); });
});
</script>

<style scoped>

</style>
