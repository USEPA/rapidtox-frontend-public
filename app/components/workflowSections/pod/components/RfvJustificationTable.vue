<template>
  <Spinner v-if="isLoading" />
  <v-container v-else>
    <v-row class="rfv-calculator-just-row-header">
      <v-col
        cols="4"
      >
        Uncertainty Factor <RfvCalculatorUncertaintyFactorDialog />
      </v-col>
      <v-col
        cols="2"
        class="text-center"
      >
        Value
      </v-col>
      <v-col
        cols="6"
        class="text-center"
      >
        Justification Statement
      </v-col>
    </v-row>
    <v-row
      v-for="(uncertainty) in editableUncertaintyData"
      :key="uncertainty.title"
    >
      <v-col
        cols="4"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="uncertainty.title" />
        <v-tooltip
          height="auto"
          width="200"
          open-on-focus
          :aria-label="uncertainty.tooltip"
        >
          <template #activator="{ props: tooltipProps }">
            <sup><nuxt-icon
              name="b/info-circle"
              v-bind="tooltipProps"
              alt="Chemical Search Information"
              tabindex="0"
              class="rapidtox-icon min-nuxt-icon ml-1"
            /></sup>
          </template>
          <template #default>
            {{ uncertainty.tooltip }}
          </template>
        </v-tooltip>
      </v-col>
      <v-col cols="2">
        <v-select
          :value="getUncertaintyValue(uncertainty.title)"
          aria-label="Select a value"
          :items="selectOptions"
          @update:model-value="setUncertaintyValue({ updatedValue: $event as number, title: uncertainty.title })"
        />
      </v-col>
      <v-col cols="6">
        <v-combobox
          v-model:search="justificationSearch[uncertainty.title]"
          label="Pick a justification statement"
          :value="getJustificationValue(uncertainty.title)"
          :hide-no-data="false"
          :model-value="getJustificationValue(uncertainty.title)"
          aria-label="Pick a justification statement"
          :custom-filter="(value, query, item) => customFilter(value, query, uncertainty.title, item)"
          :rules="[justificationRules.required,
                   justificationRules.isValidItem(uncertainty.title, getJustificationValue(uncertainty.title))]"
          :items="justificationItems[uncertainty.title]"
          :menu-props="{
            contentClass: 'justification-popover-menu',
            maxWidth: 500,
          }"
          @update:model-value="setJustificationValue({ updatedValue: $event as string, title: uncertainty.title })"
          @update:menu="updateMenu($event, uncertainty.title)"
        >
          <template #no-data>
            <v-list-item
              @click="addJustificationValue({
                updatedValue: justificationSearch[uncertainty.title] as string,
                title: uncertainty.title,
              })"
              @keyup.enter="addJustificationValue({
                updatedValue: justificationSearch[uncertainty.title] as string,
                title: uncertainty.title })"
            >
              <v-list-item-title>
                No results matching "<strong>{{ justificationSearch[uncertainty.title] }}</strong>"
                . Click here to create a new one
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="4"
        class="mt-2"
      >
        <label>Composite UF =</label>
      </v-col>
      <v-col cols="4">
        <v-text-field
          :value="props.compositeUf"
          aria-label="Converted DRSVHED"
          readonly
        />
      </v-col>
    </v-row>
    <v-row v-if="hasConversionData">
      <v-col
        cols="4"
        class="mt-2"
      >
        <label>Converted DRSV<sub>HED</sub></label>
      </v-col>
      <v-col cols="4">
        <v-text-field
          :value="props.selectedPod"
          aria-label="Converted DRSVHED"
          readonly
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import RfvCalculatorUncertaintyFactorDialog from '../dialogs/RfvCalculatorUncertaintyFactorDialog.vue';
import type {InternalItem} from '../types';
import justStatementOptions from '~/assets/fixtures/justStatementOptions.json';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';

const props = defineProps<{
  compositeUf: number | null;
  selectedPod: string;
  hasConversionData: boolean;
}>();

const emits = defineEmits<{
  updateEditableData: [data: UncertaintyFactorData[]];
}>();

const editableUncertaintyData = ref<UncertaintyFactorData[]>([]);

// Value
const selectOptions = [1, 3, 10];
const getUncertaintyValue = (title: string) => {
  const uncertainty = editableUncertaintyData.value.find(data => data.title === title);

  return uncertainty?.value || 10;
};

const setUncertaintyValue = ({title, updatedValue}: {
  title: string; updatedValue: number;
}) => {
  const uncertaintyIdx = editableUncertaintyData.value.findIndex(data => data.title === title);

  if (uncertaintyIdx >= 0) {
    editableUncertaintyData.value[uncertaintyIdx]!.value = updatedValue;
    emits('updateEditableData', editableUncertaintyData.value);
  }
};

// Justification Statement
const justificationItems = ref<{
  [key: string]: string[];
}>({});

const justificationSearch = ref<{
  [key: string]: string;
}>({});

// Handling blur event - used to show all available options and avoid autocomplete when blur occurs.
const customFilter = (value: string, query: string, title: string, item?: InternalItem) => {
  if (justificationItems.value[title]?.includes(query)) {
    return true;
  }
  return item?.value.includes(query);
};

// Handle blur event - if user clicks away while adding custom. Add to dropdown options.
const updateMenu = (menuOpen: boolean, justTitle: string) => {
  if (!menuOpen) {
    editableUncertaintyData.value.forEach(({justStatement, title}) => {
      const justificationOptions = justificationItems.value[title] as string[];
      if (justStatement && !(justificationOptions.includes(justStatement))) {
        justificationSearch.value[justTitle] = '';
        addJustificationValue({title: justTitle, updatedValue: justStatement});
      }
    });
  }
};

const addJustificationValue = ({title, updatedValue}: {
  title: string; updatedValue: string;
}) => {
  if (justificationItems.value[title] && !(justificationItems.value[title].includes(updatedValue))) {
    justificationItems.value[title]?.push(updatedValue);
  }
};

const getJustificationValue = (title: string) => {
  const uncertainty = editableUncertaintyData.value.find(data => data.title === title);
  return uncertainty?.justStatement || '';
};

const setJustificationValue = ({title, updatedValue}: {
  title: string; updatedValue: string;
}) => {
  const uncertaintyIdx = editableUncertaintyData.value.findIndex(data => data.title === title);
  if (uncertaintyIdx >= 0) {
    editableUncertaintyData.value[uncertaintyIdx]!.justStatement = updatedValue;
    emits('updateEditableData', editableUncertaintyData.value);
  }
};

const justificationRules = ref({
  required: (val: string) => !!val || 'Justification statement is required',
  isValidItem: (title: string, val: string) => {
    return justificationItems.value[title]?.some(item => item === val) || 'Justification must be in dropdown.';
  },
});

// State
const isJustificationsValid = computed(() => {
  const {required, isValidItem} = justificationRules.value;
  return editableUncertaintyData.value.every(data => isBoolean(required(data.justStatement)) &&
    isBoolean(isValidItem(data.title, data.justStatement)));
});

const isLoading = ref(true);

const onDialogOpen = (uncertaintyData: UncertaintyFactorData[]) => {
  isLoading.value = true;
  editableUncertaintyData.value = uncertaintyData;
  justificationItems.value = uncertaintyData.reduce((acc, cv) => {
    acc[cv.title] = removeDuplicates(justStatementOptions[cv.title as keyof typeof justStatementOptions]);
    justificationSearch.value[cv.title] = '';
    if (cv.justStatement && !acc[cv.title]?.includes(cv.justStatement)) {
      acc[cv.title]?.push(cv.justStatement);
    }
    return acc;
  }, {} as {
    [key: string]: string[];
  });
  isLoading.value = false;
};

defineExpose({
  onDialogOpen,
  isJustificationsValid,
});
</script>

<style scoped>
.rfv-calculator-just-row-header {
  color: #364b73;
  font-style: italic;
  font-weight: bold;
  border-bottom: 3px solid #112a59;
}
.justification-popover-menu {
  max-width: 500px;
  overflow-wrap: normal !important;
}
</style>
