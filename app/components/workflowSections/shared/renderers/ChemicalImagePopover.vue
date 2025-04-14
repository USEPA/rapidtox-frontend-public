<template>
  <Suspense>
    <span>
      <div v-if="!hasStructureImage">
        No Structure
      </div>
      <div
        v-else
      >
        <v-tooltip
          content-class="justify-content-center"
          max-height="600"
          max-width="600"
          open-on-focus
          :aria-label="`Image of ${structureData.preferredName}`"
        >
          <template #activator="{ props: tooltipProps }">
            <ChemicalImageIcon
              :data="structureData"
              v-bind="tooltipProps"
              :center-img="!!props.params.centerImg"
              tabindex="0"
              :height="props.params.imgHeight || CHEMICAL_IMAGE_POPOVER_DEFAULTS.imgHeight"
              :width="props.params.imgWidth || CHEMICAL_IMAGE_POPOVER_DEFAULTS.imgWidth"
            />
          </template>

          <template #default>
            <ChemicalImageIcon
              :data="structureData"
              :height="props.params.popoverImgHeight || CHEMICAL_IMAGE_POPOVER_DEFAULTS.popoverImgHeight"
              :width="props.params.popoverImgWidth || CHEMICAL_IMAGE_POPOVER_DEFAULTS.popoverImgWidth"
            />
          </template>
        </v-tooltip>
      </div>
    </span>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {TypeAheadSearchItem} from '../../chemicalSearch/types';
import {CHEMICAL_IMAGE_POPOVER_DEFAULTS} from '../constants';
import ChemicalImageIcon from '~/components/layout/UI/Search/ChemicalImageIcon.vue';

const props = defineProps<{
  params: ICellRendererParams<SelectedChemical> & {
    imgHeight?: string;
    imgWidth?: string;
    popoverImgHeight?: string;
    popoverImgWidth?: string;
    centerImg?: boolean;
    hasStructureImage?: boolean;
  };
}>();

const hasStructureImage = computed(() => {
  return props.params.data?.hasStructureImage;
});

const structureData = computed(() => {
  return {
    ...props.params.data,
    value: props.params.value,
    title: props.params.data?.searchWord,

  } as TypeAheadSearchItem;
});
</script>

<style scoped>
.image-tooltip-class {
  height: 200px;
}
</style>
