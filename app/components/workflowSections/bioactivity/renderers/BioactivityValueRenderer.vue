<template>
  <span>{{ display }}</span>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  params: ICellRendererParams<BioactivityBerRes> & {
    val: string | number;
    units?: string;
  };
}>();

const display = computed(() => {
  if (!props.params.val) { return '-'; }
  return `${roundedValueFormatter(typeof props.params.val === 'string' ? parseFloat(props.params.val as string) : props.params.val).toString()} ${props.params.units || ''}`;
});
</script>

<style scoped>

</style>
