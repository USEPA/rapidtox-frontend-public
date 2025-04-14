<template>
  <div
    class="chemicalImage"
    :class="{ level: !props.data.hasStructureImage }"
  >
    <div
      v-if="!props.data.hasStructureImage"
      class="relatedText"
      style="float:left; margin-right:12px;"
    />
    <img
      v-else
      :width="props.width || '70'"
      :height="props.height || '70'"
      crossorigin="anonymous"
      :src="imageUrl(props.data.dtxsid)"
      :style="centerImg ? '' : 'float:left; margin-right:12px;'"
      :alt="`Image of ${props.data.dtxsid}`"
    >
  </div>
</template>

<script setup lang="ts">
import type {TypeAheadSearchItem} from '~/components/workflowSections/chemicalSearch/types';
import type {Dtxsid} from '~~/types';

const props = defineProps<{
  data: TypeAheadSearchItem | {
    dtxsid: Dtxsid;
    hasStructureImage: boolean;
  };
  height?: string;
  width?: string;
  centerImg?: boolean;
}>();

const imageUrl = (id: Dtxsid) => {
  const {APPLICATION_CHEMICAL_ICON_IMAGE_API} = useRuntimeConfig().public;
  const url = `${APPLICATION_CHEMICAL_ICON_IMAGE_API}${id}`;
  return url;
};
</script>

<style scoped>
.chemicalImage.level {
  text-align: center;
  width: 100%;
}
.border {
  border: 2px solid darkslategrey !important;
}

.relatedText{
  height:45px;
  width:45px;
  font-size:8px;
  margin-top:9px;
  padding-top:8px;
}
</style>
