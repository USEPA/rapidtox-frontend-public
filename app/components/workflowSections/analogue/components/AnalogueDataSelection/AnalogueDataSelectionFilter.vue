<template>
  <v-select
    v-model="selectedType"
    :items="availableTypes"
  >
    <template #selection="{ item }">
      {{ getSelectPrependText(item.title as SelectedType) }} {{ item.title }}
    </template>
    <template #item="{ props: selectProps }">
      <v-list-item
        v-bind="selectProps"
        :title="`${getSelectPrependText(selectProps.title as SelectedType)} ${selectProps.title}`"
      />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import type {SelectedType} from './AnalogueDataSelection.vue';

const props = defineProps<{
  type: SelectedType;
}>();

const emits = defineEmits<{
  updateType: [val: SelectedType];
}>();

const selectedType = computed({
  get() {
    return props.type;
  },
  set(val) {
    emits('updateType', val);
  },
});

const getSelectPrependText = (text: SelectedType) => text !== 'All' ? 'Top' : '';

const availableTypes: SelectedType[] = ['10', '25', '50', '100', 'All'];
</script>

<style scoped>

</style>
