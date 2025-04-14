<template>
  <Suspense>
    <div v-if="showSelect">
      <v-combobox
        v-model="label"
        v-model:search="search"
        label="Pick a label"
        aria-label="Pick a label"
        :hide-no-data="false"
        persistent-hint
        :items="options"
        tabindex="0"
        @update:menu="onMenuUpdate"
      >
        <template #no-data>
          <v-list-item
            @click="addOptionHandler"
            @keyup.enter="addOptionHandler"
          >
            <v-list-item-title>
              No results matching "<strong>{{ search }}</strong>". Click here to create a new one
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-combobox>
    </div>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData> & {
    // eslint-disable-next-line no-unused-vars
    addRfVLabelOptions: (rfvLabel: {
      newTag: string; id: string;
    }) => void;
    podDataSelected: () => PodDataTypes[];
    // eslint-disable-next-line no-unused-vars
    updateRfvLabel: (rfvLabel: string, podIdx: number) => void;
  };
}>();

const {podDataSelected} = storeToRefs(usePodStore());

const showSelect = computed(() => props.params.node.level > 1);

const options = ref<string[]>([]);

onMounted(() => {
  options.value = props.params.data?.rfvLabelOptions || [];
  label.value = props.params.value || '';
});

const label = ref('');
const search = ref('');

const addOptionHandler = () => {
  options.value.push(search.value);
  nextTick(() => { label.value = search.value; });
  props.params.addRfVLabelOptions({newTag: search.value, id: props.params?.data?.id || ''});
};

const onMenuUpdate = (isMenuOpen: boolean) => {
  const podToUpdateIdx = props.params.podDataSelected().findIndex(({id}) => props.params?.data?.id &&
    id === props.params?.data?.id);
  if (!isMenuOpen && label.value && !props.params.podDataSelected()[podToUpdateIdx]?.rfvLabelOptions.includes(label.value)) {
    addOptionHandler();
  }

  if (label.value) {
    const podData = props.params.podDataSelected().map(pod => toRaw(pod));
    if (podToUpdateIdx >= 0 && podData[podToUpdateIdx]!.rfvLabel !== label.value) {
      podDataSelected.value[podToUpdateIdx]!.rfvLabel = label.value;
      props.params.updateRfvLabel(label.value, podToUpdateIdx);
    }
  }
};
</script>

<style scoped>

</style>
