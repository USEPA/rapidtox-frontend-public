<!--
 Wrapper component for button in the workflow section that needs to be colored according to workflow.
-->
<template>
  <v-btn
    v-bind="$attrs"
    variant="flat"
    :color="`${btnColor}`"
  >
    <template
      v-for="(_, slot) in ($slots as {})"
      #[slot]
    >
      <slot :name="slot" />
    </template>
  </v-btn>
</template>

<script setup lang="ts">
const btnColor = computed(() => getWorkflowColor());
</script>

<style scoped>

</style>
