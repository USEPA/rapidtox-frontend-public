<!-- eslint-disable vue/no-v-html -->
<template>
  <v-breadcrumbs
    :items="items"
    active-class="active-section"
  >
    <template #title="{ item }">
      <span
        :class="{ 'active-section': isActive(item.title),
                  'breadcrumb-text': true,
                  'cursor-pointer': !item.disabled }"
        :tabindex="item.disabled ? '-1' : '0'"
        @click="clickHandler(item.title)"
        @keyup.enter="clickHandler(item.title)"
        v-html="item.title"
      />
    </template>
    <template #divider>
      <nuxt-icon name="mdi/forward" />
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import type {BreadcrumbItem} from './types';

const props = defineProps<{
  items: BreadcrumbItem[];
  activeItem: BreadcrumbItem;
}>();

const emits = defineEmits<{
  updateActiveItem: [title: string];
}>();

const clickHandler = (title: string) => {
  emits('updateActiveItem', title);
};

const isActive = (title: string) => {
  if (typeof props.activeItem === 'string') {
    return props.activeItem === title;
  }
  return props.activeItem.title === title;
};
</script>

<style scoped>
:deep(.nuxt-icon svg) {
  color: #003354;
  height: 24px !important;
  width: 24px !important;
}
.active-section {
  color: darkgreen !important;
  text-decoration: underline;
}

:deep(.v-breadcrumbs--density-default) {
  padding-top: 10px;
  padding-bottom: 10px;
}
.breadcrumb-text {
  font-size: 24px !important;
  font-weight: 600;
}
</style>
