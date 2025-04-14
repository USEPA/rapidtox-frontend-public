<template>
  <div>
    <TypeAheadSearch @on-select="loadMolFile" />
    <Ketcher
      :current-analogue-steps-data="props.currentAnalogueStepsData"
    />
    <LoadingMolFileError
      :show="errorMolFile"
      :error-message="errorMessage"
      @close-error-dialog="errorMolFile = false"
    />
  </div>
</template>

<script setup lang="ts">
import LoadingMolFileError from '../../dialogs/LoadingMolFileErrorDialog.vue';
import Ketcher from './Ketcher.vue';
import type {TypeAheadSearchItem} from '~/components/workflowSections/chemicalSearch/types';
import TypeAheadSearch from '~/components/layout/UI/Search/TypeAheadSearch.vue';

const props = defineProps<{
  currentAnalogueStepsData: AnalogueStepInfo | undefined;
}>();

const analogueStore = useAnalogueStore();
const {setCurrentUnmatchedDtxsid, loadKetcherImage} = analogueStore;
const {errorMessage, errorMolFile} = storeToRefs(analogueStore);

const loadMolFile = ({chem}: {
  chem: TypeAheadSearchItem; searchText: string;
}) => {
  setCurrentUnmatchedDtxsid(chem?.dtxsid);
  loadKetcherImage(chem?.dtxsid);
};
</script>

<style scoped>

</style>
