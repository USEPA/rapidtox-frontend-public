<template>
  <section>
    <v-btn
      v-if="!isWorkflowReports && !inWorkflow"
      tabindex="0"
      aria-label="workflow reports link"
      data-cy="WorkflowReportNavItem"
      style="text-decoration: underline"
      to="/workflow-reports"
      title="Click here to view workflow reports for all sessions."
    >
      <nuxt-icon
        name="b/file-text"
        icon="file-text"
        alt="All workflow reports icon"
        aria-hidden="true"
        class="ml-2 mr-2 new-session-icon"
      /> Workflow Reports
    </v-btn>
  </section>
</template>

<script setup lang="ts">
const {inWorkflow, isWorkflowReports} = useLocation();
</script>
wes
