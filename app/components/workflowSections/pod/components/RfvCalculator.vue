<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        class="text-center fw-bold text-decoration-underline"
      >
        RfV Calculator
      </v-col>
    </v-row>
    <v-row
      v-for="field in calculatedFields"
      :key="field.title"
    >
      <v-col
        cols="4"
        class="mt-3"
      >
        <label :for="`rfc-calc-readonly-${props.params.data?.id}-${field.title}-field`">
          {{ field.title }}
        </label>
      </v-col>
      <v-col cols="4">
        <v-text-field
          :id="`rfc-calc-readonly-${props.params.data?.id}-${field.title}-field`"
          readonly
        >
          {{ field.value }}
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {PodConversionData} from '../types';

interface IProps {
  uncertaintyFactorData: UncertaintyFactorData[];
  isFormValid: boolean;
  params: ICellRendererParams<PodUncertaintyData>;
  conversionData: PodConversionData;
}

const props = withDefaults(defineProps<IProps>(), {
  uncertaintyFactorData: () => [],
  isFormValid: false,
});

const roundUpToPrecision = (number: number, digits: number) => {
  if (Number.isNaN(number) || Number.isNaN(digits)) { return null; }
  const round = number.toPrecision(digits);

  if (round === number.toString()) {
    return number;
  }

  return +(number + 0.5 * 10 ** (Math.floor(Math.log(number) * Math.LOG10E) - 1)).toPrecision(digits);
};

const calculatedCompositeUf = computed(() => {
  if (props.uncertaintyFactorData.length) {
    const calculatedVal = props.uncertaintyFactorData?.map(uncertainty => uncertainty.value)?.reduce((acc, cv) => acc * cv);
    const formattedCalVal = roundUpToPrecision(calculatedVal, 1);
    return Number.isNaN(formattedCalVal) ? '' : formattedCalVal;
  }
  return '';
});

const compositeUf = computed(() => {
  if (props.uncertaintyFactorData.length && props.isFormValid) {
    return calculatedCompositeUf.value;
  }
  return '';
});

const podVal = computed(() => props.conversionData.podhed !== null ?
  props.conversionData.podhed :
  Number(props.params.data?.podValue));

const podUnits = computed(() => props.conversionData.podhed !== null ? 'mg/kg/day' : props.params.data?.toxvalUnits);

const selectedPod = computed(() => `${podVal.value} ${podUnits.value}`);

const selectedPodDisplay = computed(() => {
  if (props.isFormValid) {
    return `${podVal.value} ${podUnits.value}`;
  }

  return '';
});

const interimRfvValue = computed(() => {
  if (props.isFormValid) {
    return `${(podVal.value / (compositeUf!.value || 1)).toExponential(0)} ${podUnits.value}`;
  }
  return '';
});

const calculatedFields = computed(() => [
  {
    title: 'Selected DRSV = ', value: selectedPodDisplay.value,
  },
  {
    title: 'Composite UF = ', value: compositeUf.value,
  },
  {
    title: 'Interim RapidTox RfV = DRSV/UF = ', value: interimRfvValue.value,
  },
]);

defineExpose({
  calculatedCompositeUf,
  compositeUf,
  selectedPod,
  interimRfvValue,
});
</script>

<style scoped>

</style>
