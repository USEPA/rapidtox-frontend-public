<template>
  <v-container>
    <v-row
      justify="space-between"
    >
      <template
        v-for="field in editableFields"
        :key="field.title"
      >
        <v-col
          cols="2"
        >
          <label
            :for="`unit-conversion-${field.title}-${props.params?.data?.id || ''}-editable-field`"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="field.title" />
            <v-tooltip
              v-if="field.tooltip"
              height="auto"
              width="200"
              open-on-focus
              :aria-label="field.tooltip"
            >
              <template #activator="{ props: tooltipProps }">
                <sup><nuxt-icon
                  name="b/info-circle"
                  v-bind="tooltipProps"
                  :alt="`${field.title} Information`"
                  tabindex="0"
                  class="rapidtox-icon min-nuxt-icon ml-1"
                /></sup>
              </template>
              <template #default>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="field.tooltip" />
              </template>
            </v-tooltip>
          </label>
        </v-col>
      </template>
    </v-row>
    <v-row justify="space-between">
      <template
        v-for="field in editableFields"
        :key="field.title"
      >
        <v-col
          cols="2"
        >
          <component
            :is="dynamicComponentMap[field.inputType as keyof DynamicComponentMap]"
            v-bind="field.props"
            :id="`unit-conversion-${field.title}-${props.params?.data?.id || ''}-editable-field`"
            v-model="field.value"
            :aria-label="`${field.title} Input`"
          />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {
  type AdjustmentRateTitles, ADJUSTMENT_RATE_TITLES, UNIT_CONV_EDITABLE_FIELDS,
} from '../constants';
import type {EditableFields, PodConversionData} from '../types';
import {dynamicVuetifyComponentMap} from '../../shared/constants';
import type {DynamicComponentMap} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData>;
  conversionData: PodConversionData;
}>();

const adjustmentData = ref<{
  title: AdjustmentRateTitles; value: number;
}[]>([
  {
    title: ADJUSTMENT_RATE_TITLES.RAT, value: 0.24,
  },
  {
    title: ADJUSTMENT_RATE_TITLES.MOUSE, value: 0.14,
  },
  {
    title: ADJUSTMENT_RATE_TITLES.DOG, value: 0.63,
  },
  {
    title: ADJUSTMENT_RATE_TITLES.HUMAN, value: 1.00,
  },
  {
    title: ADJUSTMENT_RATE_TITLES.CUSTOM, value: 0.00,
  },
]);

const adjustmentFactor = ref<string | null>('');
const isAdjustmentRateEditableOnMount = computed(() => {
  if (!adjustmentFactor.value) {
    return false;
  }

  return adjustmentFactor.value === ADJUSTMENT_RATE_TITLES.CUSTOM;
});

const adjustmentFactorValue = computed({
  get() {
    const adjustment = adjustmentData.value.find(({title}) => title === adjustmentFactor.value);
    return adjustment?.value || 0;
  },
  set(val) {
    const adjustmentIdx = adjustmentData.value.findIndex(({title}) => title === adjustmentFactor.value);
    adjustmentData.value[adjustmentIdx]!.value = val;
  },
});

const sourcePod = ref<number | null>(null);

const isSourceAndAdjustmentValid = computed(() => sourcePod.value !== null && !!adjustmentFactor.value);

const podHed = computed(() => {
  if (!isSourceAndAdjustmentValid.value) {
    return '';
  }
  const calculation = (sourcePod?.value || 0) * adjustmentFactorValue?.value;
  return decimalScientificNotation(calculation);
});

const onDialogOpen = () => {
  addAriaLabelToNumberInputs();
  sourcePod.value = Number.isNaN(props.conversionData.convertedValue) ? null : props.conversionData.convertedValue;
  const adjustmentFactorData = adjustmentData.value
    .find(data => data.title === props.conversionData.adjustmentFactorName);

  adjustmentFactor.value = adjustmentFactorData?.title || null;
  if (props.conversionData.adjustmentFactorName === ADJUSTMENT_RATE_TITLES.CUSTOM) {
    const customAdjustmentDataIdx = adjustmentData.value.findIndex(({title}) => title === ADJUSTMENT_RATE_TITLES.CUSTOM);
    adjustmentData.value[customAdjustmentDataIdx]!.value = props.conversionData.adjustmentFactor || 0;
  }
};

const editableFields = ref<EditableFields[]>([
  {
    title: UNIT_CONV_EDITABLE_FIELDS.SOURCE_DRSV,
    inputType: 'v-number-input',
    value: sourcePod,
    tooltip: `This modal provides the opportunity to convert an experimental animal dose response summary value (DRSV)
        to a corresponding human equivalent DRSV (DRSV<sub>HED</sub>) using body-weight
        allometric scaling as per 2011 EPA guidance.`,
    props: {
      min: 0,
    },
  },
  {
    title: UNIT_CONV_EDITABLE_FIELDS.SPECIES,
    inputType: 'v-select',
    value: adjustmentFactor,
    props: {
      items: adjustmentData.value,
      'item-value': 'title',
    },
  },
  {
    title: UNIT_CONV_EDITABLE_FIELDS.ADJ_RATE,
    inputType: 'v-number-input',
    value: adjustmentFactorValue,
    props: {
      readonly: !isAdjustmentRateEditableOnMount.value,
      min: 0,
    },
  },
  {
    title: UNIT_CONV_EDITABLE_FIELDS.DRSVHED,
    inputType: 'v-text-field',
    value: podHed,
    props: {
      readonly: true,
    },

  },
  {
    title: UNIT_CONV_EDITABLE_FIELDS.DRSV_UNITS,
    inputType: 'v-text-field',
    value: 'mg/kg-day',
    tooltip: 'For human health assessment purposes, the oral units should be in mg/kg-day. If alternative units are used for the source DRSV (e.g., ppm diet or water), the user is advised to calculate a corresponding dose in mg/kg-day using appropriate intake and body-weight based adjustment factors consistent with the species/strain and enter the resultant mg/kg-day source DRSV into “Source DRSV" box.',
    props: {
      readonly: true,
    },

  },
]);

watch(adjustmentFactor, (newVal) => {
  const adjustmentRateIdx = editableFields.value.findIndex(({title}) => title === UNIT_CONV_EDITABLE_FIELDS.ADJ_RATE);
  if (newVal === ADJUSTMENT_RATE_TITLES.CUSTOM) {
    if (adjustmentRateIdx >= 0) {
      editableFields.value[adjustmentRateIdx]!.props!.readonly = false;
    }
    document.getElementById(`unit-conversion-${UNIT_CONV_EDITABLE_FIELDS.ADJ_RATE}-${props.params?.data?.id || ''}-editable-field`)?.focus();
  } else {
    editableFields.value[adjustmentRateIdx]!.props!.readonly = true;
  }
});

const dynamicComponentMap = shallowRef<DynamicComponentMap>(dynamicVuetifyComponentMap);

const clearFields = () => {
  const fieldsToClear = [UNIT_CONV_EDITABLE_FIELDS.SOURCE_DRSV, UNIT_CONV_EDITABLE_FIELDS.SPECIES];
  editableFields.value.forEach((field) => {
    if (fieldsToClear.includes(field.title)) {
      field.value = null;
    }
  });
};

defineExpose({
  onDialogOpen,
  sourcePod,
  adjustmentData,
  adjustmentFactor,
  adjustmentFactorValue,
  podHed,
  clearFields,
  isSourceAndAdjustmentValid,
});
</script>

<style scoped>

</style>
