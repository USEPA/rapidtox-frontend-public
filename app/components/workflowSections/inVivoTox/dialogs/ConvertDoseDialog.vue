<template>
  <v-dialog
    aria-label="Convert Dose"
    width="1000"
    @after-leave="onDialogClose"
  >
    <template #activator="{ props: dialogProps }">
      <WorkflowButton
        v-bind="dialogProps"
        tabindex="0"
      >
        Convert Dose
      </WorkflowButton>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Convert Dose
          <v-spacer />
          <v-btn
            @click="isActive.value = false"
          >
            <nuxt-icon
              class="min-nuxt-icon text-white"
              alt="Close"
              aria-label="Close"
              name="mdi/close"
            />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="8"
                offset="2"
              >
                <v-alert>
                  <nuxt-icon
                    name="mdi/help-circle"
                    class="min-nuxt-icon"
                  /> <i>Assumes 1 atmosphere and a temperature of 25&deg;C</i>
                </v-alert>
              </v-col>
            </v-row>
            <v-row justify="center">
              <!-- Static Fields -->
              <ConvertDoseStaticFields v-bind="props" />
              <!-- Converted Fields -->
              <v-col
                v-for="input in convertedFields"
                :key="input.props?.label"
                :class="input.class"
                :cols="input.cols || 3"
              >
                <component
                  :is="dynamicComponentMap[input.inputType as keyof DynamicComponentMap]"
                  v-model="input.value"
                  :aria-label="`${input.props?.label} Input`"
                  v-bind="input.props"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="!isSaving && isDuplicateConversion"
              justify="center"
            >
              <v-col cols="6">
                <v-alert
                  text="Conversion already exists."
                  type="error"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <WorkflowButton
            text="Save"
            :disabled="isDuplicateConversion"
            @click="saveConversion(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import {getWorkflowBgColor} from '../../shared/helpers';
import type {ConvertDoseInput} from '../types';
import {
  conversionFormulas, convertDose,
  convertSuperCategoryName,
} from '../helpers/convertDoseHelpers';
import ConvertDoseStaticFields from '../components/ConvertDoseStaticFields.vue';
import {dynamicVuetifyComponentMap} from '../../shared/constants';
import type {DynamicComponentMap, PodData} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<PodData>;
}>();

const emits = defineEmits<{
  showError: [];
}>();

// Dialog
const onDialogClose = () => {
  isSaving.value = false;
};

// Save Button
const dynamicComponentMap = shallowRef<DynamicComponentMap>(dynamicVuetifyComponentMap);

const hazardStore = useHazardStore();
const {$patch: hazardPatch} = hazardStore;
const {hazardChartData} = storeToRefs(hazardStore);

const {saveSession} = useSessionStore();

const isDuplicateConversion = computed(() => {
  return hazardChartData.value.some(({
    originalHazardId,
  }) => originalHazardId === props.params.data?.id);
});

const isSaving = ref(false);

const saveConversion = (isActive: globalThis.Ref<boolean, boolean>) => {
  try {
    if (!isDuplicateConversion.value) {
      isSaving.value = true;
      const newConversion = {
        ...props.params.data,
        originalHazardId: props.params.data?.id,
        toxvalNumeric: Number(convertedValue.value),
        toxvalUnits: convertToUnits.value,
        superCategory: convertSuperCategoryName(props.params.data?.superCategory),
        podId: genUID('pod'),
        id: genHazardId(),
      } as PodData;
      isActive.value = false;
      hazardPatch((state) => {
        state.hazardChartData.push(newConversion);
      });
      saveSession('hazard');
    }
  } catch {
    emits('showError');
  }
};

// Converted Fields
const convertToUnits = computed(() => {
  const allowedConversionFormula = conversionFormulas.find(({from}) => from === props.params.data?.toxvalUnits);
  return allowedConversionFormula?.to || '';
});

const convertedValue = computed(() => roundedValueFormatter(convertDose({
  to: convertToUnits.value,
  from: props.params.data?.toxvalUnits || '',
  molWeight: props.params.data?.molecularWeight || 0,
  val: Number(props.params?.data?.toxvalNumeric),
})).toString());

const convertedFields = ref<ConvertDoseInput[]>([
  {
    cols: 4,
    class: 'converted-dose-border converted-dose-border-left',
    props: {
      readonly: true,
      label: 'Converted Dose Value',

    },
    inputType: 'v-text-field',
    podKey: 'toxvalNumeric',
    value: convertedValue.value,
  },
  {
    value: convertToUnits.value,
    podKey: 'toxvalUnits',
    inputType: 'v-text-field',
    cols: 4,
    class: 'converted-dose-border converted-dose-border-right',
    props: {
      readonly: true,
      label: 'Converted Dose Units',

    },
  },
]);
</script>

<style scoped>
.converted-dose-border {
  border-top: 4px solid black;
  border-bottom: 4px solid black;
}

.converted-dose-border-left {
  border-left: 4px solid black;
}

.converted-dose-border-right {
  border-right: 4px solid black;
}
</style>
