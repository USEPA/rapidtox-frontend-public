import {
  VTextField, VSelect, VBtn, VTextarea,
} from 'vuetify/components';
import {VNumberInput} from 'vuetify/labs/VNumberInput';

// Vuetify Component Map used for dynamimc components
export const dynamicVuetifyComponentMap = {
  'v-select': VSelect,
  'v-text-field': VTextField,
  'v-btn': VBtn,
  'v-text-area': VTextarea,
  'v-number-input': VNumberInput,
};

/**
 * Configuration Map for group expansion by default
 * https://jira.epa.gov/browse/RAPIDTOX-1720
 * https://www.ag-grid.com/vue-data-grid/grid-options/#reference-rowGrouping-groupDefaultExpanded
 */
export const sectionGroupDefaultExpandedMap: Partial<{
  // eslint-disable-next-line no-unused-vars
  [key in TabKey]: {
    singleChemcal: number; multiChemical: number;
  };
}> = {
  envFate: {
    singleChemcal: -1, multiChemical: 0,
  },
  physChem: {
    singleChemcal: -1, multiChemical: 0,
  },
  hazard: {
    singleChemcal: 1, multiChemical: 0,
  },
};

export const CHEMICAL_IMAGE_POPOVER_DEFAULTS = {
  imgHeight: '70',
  imgWidth: '70',
  popoverImgHeight: '300',
  popoverImgWidth: '300',
};
