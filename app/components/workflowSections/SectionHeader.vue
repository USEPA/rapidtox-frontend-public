<template>
  <v-row
    class="mt-4 pl-2 d-flex justify-content-start"
    justify="start"
  >
    <v-col
      class="flex-grow-0 flex-shrink-1"
      cols="auto"
      :align-self="props.headerAlignSelf"
    >
      <h1 class="section-title font-weight-bold w-100">
        <slot name="title">
          {{ props.title }}
        </slot>
        <v-tooltip
          open-on-focus
          :aria-label="props.tooltipText"
          :text="props.tooltipText"
          width="400"
          name="section description"
        >
          <template #activator="{ props: tooltipProps }">
            <nuxt-icon
              :id="`${props.section}-tip`"
              name="b/info-circle"
              v-bind="tooltipProps"
              :alt="`${props.section} Information`"
              tabindex="0"
              class="rapidtox-icon pl-2"
            />
          </template>
        </v-tooltip>
      </h1>
    </v-col>
    <slot name="prepend" />
    <v-col
      v-if="props.chemicalsNotFound.length"
      class="pt-0 flex-grow-1 flex-shrink-0"
      cols="auto"
    >
      <ChemDataNotFoundAlert
        :chemicals-not-found="props.chemicalsNotFound"
        :section="props.section"
      />
    </v-col>
    <slot name="append" />
  </v-row>
</template>

<script setup lang="ts">
import ChemDataNotFoundAlert from './shared/alerts/ChemDataNotFoundAlert.vue';

interface IProps {
  tooltipText: string;
  title?: string;
  section: string;
  chemicalsNotFound?: string[];
  headerAlignSelf?: 'start' | 'center' | 'end';
}

const props = withDefaults(defineProps<IProps>(), {
  tooltipText: '',
  title: '',
  section: '',
  chemicalsNotFound: () => [],
  headerAlignSelf: 'start',
});
</script>

<style scoped>
:deep(.nuxt-icon svg) {
  width: 40px;
  height: 50px;
}
:deep(.nuxt-icon.smaller svg) {
  width: 25px;
  height: 25px;
}

:deep(.rapidtox-icon) {
  cursor: help;
}
</style>
