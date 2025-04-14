import { ref, computed, watch, onMounted } from "vue";

<template>
  <span>
    <input
      v-model="currentValue"
      class="ag-floating-filter-input ag-input-field-input"
      type="text"
      :placeholder="getPlaceholderText"
      @input="onInputBoxChanged()"
    >
  </span>
</template>

<script setup lang="ts">
import type {FilterChangedEvent, ITextFloatingFilterParams} from 'ag-grid-community';

interface ParentModel {
  filterType: string;
  type: string;
  filter: string;
}

const props = defineProps<{
  params: ITextFloatingFilterParams & {
    placeholderText: string;
  };
}>();

const currentValue = ref<string | null>(null);
const placeholderText = ref('Filter...');

const onInputBoxChanged = () => {
  if (currentValue.value === '') {
    props.params.parentFilterInstance((instance) => {
      instance.onFloatingFilterChanged(null, null);
    });
    return;
  }

  props.params.parentFilterInstance((instance) => {
    instance.onFloatingFilterChanged('contains', currentValue.value as null);
  });
};

// Instance method - https://www.ag-grid.com/vue-data-grid/component-floating-filter/
// eslint-disable-next-line no-unused-vars
const onParentModelChanged = (parentModel: ParentModel, _event: FilterChangedEvent) => {
  // When the filter is empty we will receive a null value here
  if (!parentModel) {
    currentValue.value = '';
  } else {
    currentValue.value = parentModel.filter;
  }
};

const getPlaceholderText = computed(() => props.params.placeholderText || placeholderText.value);
</script>
