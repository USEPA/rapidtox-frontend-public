<template>
  <Suspense>
    <div v-if="containsData">
      <nuxt-icon
        name="b/check2"
        class="rapidtox-icon cursor-help"
      />
      <span style="color: #0071bc !important;cursor: help; font-weight: 700 !important;position: absolute">
        ({{ count }})
      </span>
    </div>
    <div v-else>
      <nuxt-icon
        name="b/dash"
        class="rapidtox-icon cursor-help"
      />
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {CombinedAnalogueDataSelectionType} from '../types';

const props = defineProps<{
  params: ICellRendererParams<CombinedAnalogueDataSelectionType> & {
    section: string;
  };
}>();
const dataKey = computed(() => {
  return `${props.params.section}Total` as keyof CombinedAnalogueDataSelectionType;
});

const count = computed(() => props.params?.data?.[dataKey.value] as number || 0);

const containsData = computed(() => count.value > 0);
</script>

<style scoped>

</style>
