<template>
  <NuxtLayout name="epa">
    <main
      id="main"
      class="container-fluid main-content px-0"
    >
      <WorkflowContainer />
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import WorkflowContainer from '~/components/workflowSections/WorkflowContainer.vue';

definePageMeta({
  middleware: 'workflow-route',
});

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: `${useRuntimeConfig().public?.APPLICATION_ROUTER_BASE || '/'}${useWorkflowData().stylesheet}`,
    },
  ],
});
</script>

<style scoped>

</style>
