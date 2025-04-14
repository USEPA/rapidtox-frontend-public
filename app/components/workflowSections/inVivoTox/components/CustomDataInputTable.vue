<template>
  <v-table
    class="custom-input-data-table"
  >
    <thead>
      <tr>
        <th
          v-for="column in tableConfig"
          :id="`${column.header}-custom-data-input-column-header`"
          :key="column.header"
          class="custom-data-input-form-header"
        >
          {{ column.header }}<abbr
            v-if="column.required"
            title="required"
            class="text-red ml-1"
          >* </abbr>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="spacer"
        style="height: 20px"
      />
      <tr>
        <td
          v-for="column in tableConfig"
          :key="column.podKey"
          :style="column.cellStyle"
        >
          <component
            :is="dynamicComponentMap[column.inputType as keyof DynamicComponentMap]"
            v-if="column.inputType !== 'v-btn'"
            v-model="column.value"
            :aria-labelledby="`${column.header}-custom-data-input-column-header`"
            :aria-label="`${column.header} Input`"
            v-bind="column.props"
          />
          <WorkflowButton
            v-else
            :disabled="isSubmitDisabled"
            @click="($event: MouseEvent) => submitHandler($event)"
          >
            Submit
          </WorkflowButton>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import type {CustomDataInputTableConfig} from '../types';
import {dynamicVuetifyComponentMap} from '../../shared/constants';
import type {DynamicComponentMap, PodData} from '~~/types';

const emits = defineEmits<{
  addData: [formData: PodData];
}>();

const resetForm = () => {
  tableConfig.value = tableConfig.value.map(config => ({
    ...config,
    value: '',
  }));
};

const submitHandler = (ev: MouseEvent) => {
  ev.preventDefault();
  if (!isSubmitDisabled.value) {
    const formData = tableConfig.value
      .filter(config => config.podKey !== 'action')
      .reduce((acc, cv) => {
        const key = cv.podKey as keyof PodData;
        (acc as Record<typeof key, string | number>)[key] = cv.value && cv.props?.type === 'number' ? Number.parseFloat(cv.value) : cv.value;
        return acc;
      }, {} as PodData);
    formData.podId = genUID('pod');
    formData.id = genHazardId();
    formData.workflow = '-';
    formData.toxvalSubtype = '-';
    emits('addData', formData);
    resetForm();
  }
};

const dynamicComponentMap = shallowRef<DynamicComponentMap>(dynamicVuetifyComponentMap);

const studyTypes = ['acute', 'short-term', 'subchronic', 'chronic', 'reproduction', 'developmental', 'carcinogenicity'];

const isSubmitDisabled = computed(() => {
  const fieldsRequiredForSubmit = ['superCategory', 'studyType', 'toxvalNumeric'];
  return tableConfig.value
    .filter(({podKey}) => fieldsRequiredForSubmit.includes(podKey))
    .some(({value}) => !value);
});

const tableConfig = ref<CustomDataInputTableConfig[]>([
  {
    header: 'Super Category',
    value: '',
    podKey: 'superCategory',
    cellStyle: 'min-width: 150px !important',
    inputType: 'v-select',
    required: true,
    props: {
      items: [
        {
          value: SUPER_HAZARD_TYPES.CUSTOM_POD_NAME, title: 'DRSV',
        },
        {
          value: SUPER_HAZARD_TYPES.CUSTOM_TOX_NAME, title: SUPER_HAZARD_TYPES.TOX_NAME,
        },
      ],
    },
  },
  {
    header: 'Study Type',
    value: '',
    podKey: 'studyType',
    required: true,
    inputType: 'v-select',
    cellStyle: 'min-width: 150px !important',
    props: {
      items: studyTypes,
    },
  },
  {
    header: 'Study Duration',
    value: '',
    podKey: 'studyDuration',
    inputType: 'v-text-field',
    cellStyle: 'min-width: 75px !important',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Study Duration Units',
    value: '',
    podKey: 'studyDurationUnits',
    inputType: 'v-text-field',
    cellStyle: 'min-width: 75px !important',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Species',
    value: '',
    podKey: 'speciesCommon',
    cellStyle: 'min-width: 75px !important',
    inputType: 'v-text-field',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Type',
    value: '',
    podKey: 'toxvalType',
    cellStyle: 'min-width: 125px !important',
    inputType: 'v-text-field',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Value',
    value: '',
    podKey: 'toxvalNumeric',
    required: true,
    cellStyle: 'min-width: 125px !important',
    inputType: 'v-text-field',
    props: {
      type: 'number',
      required: (val: string) => !!val || 'Session name is required',
    },
  },
  {
    header: 'Units',
    value: '',
    podKey: 'toxvalUnits',
    cellStyle: 'min-width: 75px !important',
    inputType: 'v-text-field',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Exposure Route',
    value: '',
    podKey: 'exposureRoute',
    cellStyle: 'min-width:  125px !important',
    inputType: 'v-select',
    props: {
      type: 'text',
      items: ['oral', 'inhalation'],
    },
  },
  {
    header: 'Exposure Method',
    value: '',
    podKey: 'exposureMethod',
    cellStyle: 'min-width: 75px !important',
    inputType: 'v-text-field',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Effect',
    value: '',
    podKey: 'effect',
    cellStyle: 'min-width: 75px !important',
    inputType: 'v-text-field',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Source',
    value: '',
    podKey: 'superSource',
    cellStyle: 'min-width: 75px !important',
    inputType: 'v-text-field',
    props: {
      type: 'text',
    },
  },
  {
    header: 'Action',
    value: '',
    podKey: 'action',
    inputType: 'v-btn',
  },
]);
</script>

<style scoped>
.custom-data-input-form-header {
  font-size: 20px;
}
</style>
