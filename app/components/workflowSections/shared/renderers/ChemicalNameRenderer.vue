<template>
  <Suspense>
    <div class="name-icon">
      <v-menu
        v-if="chemicalData"
        v-model="isOpen"
        open-on-focus
        open-on-hover
        location="end"
        content-class="chemical-name-content"
        :aria-label="`Image of ${chemicalData.preferredName}`"
        :text="`Image of ${chemicalData.preferredName}`"
        max-width="800"
        attach=".ag-theme-balham"
      >
        <template #activator="{ props: tooltipProps }">
          <nuxt-icon
            name="b/info-circle"
            v-bind="tooltipProps"
            role="tooltip"
            alt="Chemical Search Information"
            tabindex="0"
            class="rapidtox-icon"
          />
          <span
            :data-testid="`chemical-name-renderer-pref-name-${chemicalData.preferredName}`"
            class="chemical-name-renderer-text"
          >
            {{ chemicalData.preferredName }}
          </span>
        </template>
        <template #default>
          <v-card>
            <v-toolbar class="pl-4 tooltip-header">
              <h3 class="font-weight-bold">
                {{ chemicalData.preferredName }}
              </h3>
              <v-spacer />
              <v-btn
                variant="flat"
                @click="closeMenuHandler()"
              >
                <nuxt-icon
                  class="min-nuxt-icon"
                  alt="Close"
                  aria-label="Close"
                  name="mdi/close"
                />
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <h4
                v-if="chemicalData.casrn"
                class="text-black"
              >
                <strong>CASRN:</strong> {{ chemicalData.casrn }}
              </h4>
              <h4
                v-if="chemicalData.dtxsid"
                class="text-black"
              >
                <strong>DTXSID:</strong> <a
                  :href="`${$config.public.CCD_DASHBOARD_URL}chemical/details/${chemicalData.dtxsid}`"
                  rel="noopener noreferrer"
                  target="_blank"
                  tabindex="0"
                  style="color: darkblue;
                  text-decoration: underline"
                >{{ chemicalData.dtxsid }}</a>
              </h4>
              <span class="text-center">
                <span v-if="!chemicalData.hasStructureImage">
                  No structure
                </span>
                <ChemicalImageIcon
                  v-else
                  :data="{
                    dtxsid: chemicalData.dtxsid,
                    hasStructureImage: chemicalData.hasStructureImage as boolean,
                  }"
                  :height="CHEMICAL_IMAGE_POPOVER_DEFAULTS.popoverImgHeight"
                  :width="CHEMICAL_IMAGE_POPOVER_DEFAULTS.popoverImgWidth"
                  :center-img="true"
                />
              </span>
            </v-card-text>
            <v-card-actions class="float-right">
              <v-btn
                text="Close"
                variant="flat"
                data-testid="chem-data-not-found-footer-close-btn"
                @click="closeMenuHandler()"
              />
            </v-card-actions>
          </v-card>
        </template>
      </v-menu>
    </div>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {Column, ICellRendererParams} from 'ag-grid-community';
import {CHEMICAL_IMAGE_POPOVER_DEFAULTS} from '../constants';
import ChemicalImageIcon from '~/components/layout/UI/Search/ChemicalImageIcon.vue';

const {selectedChemicals} = storeToRefs(useChemicalSearchStore());

const props = defineProps<{
  params: ICellRendererParams;
}>();

const isOpen = ref(false);

const closeMenuHandler = () => {
  isOpen.value = false;
  nextTick(() => {
    props.params.api.setFocusedCell(props.params.node.rowIndex!, props.params.column as Column);
  });
};

const chemicalData = computed(() => {
  const chemical = selectedChemicals.value
    .find(chem => chem.preferredName === props.params.value || chem.dtxsid === props.params.value);

  if (!chemical) {
    return null;
  }
  return {
    ...chemical,
  } as SelectedChemical;
});
</script>

<style scoped>
.tooltip-header {
  background-color: white !important;
}
.chemical-name-renderer-text {
  vertical-align: middle;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 90%;
}
</style>
