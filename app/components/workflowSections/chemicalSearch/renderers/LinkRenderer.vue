<template>
  <Suspense>
    <button
      v-if="hasLink"
      @click="iconClickHandler"
      @keyup.enter="iconClickHandler"
    >
      <nuxt-icon
        tabindex="0"
        data-cy="linkIcon"
        :name="hasLink.iconType"
        class="ml-2 new-session-icon rapidtox-icon"
        :aria-label="hasLink.labelText"
        :alt-text="hasLink.labelText"
      />
    </button>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams<SelectedChemical>;
}>();

const hasLink = computed(() => {
  if (props.params?.column?.getColId() === 'safetyLink' && props.params?.value) {
    const safetyLinkUrl = useRuntimeConfig().public.APPLICATION_SAFETY_LINKS_API;
    return {
      linkUrl: `${safetyLinkUrl}${props.params?.value}`,
      labelText: 'Safety External Link',
      iconType: 'mdi/safety-goggles',
    };
  }
  if (props.params?.column?.getColId() === 'nioshLink' && props.params?.value) {
    return {
      linkUrl: `${props.params?.value}`,
      labelText: 'NIOSH External Link',
      iconType: 'b/flask-solid',
    };
  }
  return null;
});

const iconClickHandler = () => {
  navigateTo(hasLink?.value?.linkUrl, {
    external: true,
    open: {
      target: '_blank',
    },
  });
};
</script>

<style scoped>

</style>
