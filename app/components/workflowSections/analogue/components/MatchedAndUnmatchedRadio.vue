<template>
  <v-radio-group
    v-model="selection"
    class="bordered-radio-group"
    inline
  >
    <v-radio
      label="Matched"
      value="matched"
      :title="title(hasMatchedData, 'Matched')"
      :class="`${hasMatchedData ? 'active' : 'disabled'}-radio`"
      tabindex="0"
    >
      <template #label>
        <span :title="title(hasMatchedData, 'Matched')">Matched</span>
      </template>
    </v-radio>
    <v-radio
      label="Unmatched"
      value="unmatched"
      :title="title(hasUnmatchedData, 'Unmatched')"
      :class="`${hasUnmatchedData ? 'active' : 'disabled'}-radio`"
      tabindex="0"
    >
      <template #label>
        <span :title="title(hasUnmatchedData, 'Unmatched')">Unmatched</span>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script setup lang="ts">
import type {DisplayType} from '../types';

const props = defineProps<{
  displayType: DisplayType;
  hasMatchedData: boolean;
  hasUnmatchedData: boolean;
}>();

const emits = defineEmits<{
  setDisplayType: [type: DisplayType];
}>();

const selection = computed({
  get() {
    return props.displayType;
  },
  set(type) {
    emits('setDisplayType', type);
  },
});

const title = (hasData: boolean, dataType: string) => hasData ? `Click here to view ${dataType} chemicals.` : `There are no ${dataType} chemicals.`;
</script>

<style scoped>

</style>
