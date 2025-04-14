<template>
  <div
    ref="userOptions"
    :class="`bg-${workflowId}`"
    class="nav-container fluid"
  >
    <a
      id="skiplink"
      tabindex="0"
      data-cy="rtSkipLink"
      class="skiplink"
      :href="linkTo"
    >skip to main content</a>
    <v-toolbar
      id="top-nav-bar"
      aria-label="main navigation"
      :class="`bg-${workflowId}`"
      class="text-white"
    >
      <div
        v-if="title.length"
        class="text-nowrap
        pl-4 pr-4 border-end border-white border-3"
      >
        <h1 style="font-size: 1.1em !important; ">
          {{ title }}
        </h1>
      </div>
      <slot name="homeLink">
        <HomeLink />
      </slot>
      <slot name="sessionOptions">
        <SessionOptions />
      </slot>
      <slot name="workflowReportsLink">
        <WorkflowReportsLink />
      </slot>
      <slot name="releaseNotesLink">
        <ReleaseNotesLink />
      </slot>
      <v-spacer />
      <slot name="welcomeLogout">
        <WelcomeLogout />
      </slot>
    </v-toolbar>
  </div>
</template>

<script setup lang="ts">
import WelcomeLogout from './WelcomeLogout.vue';
import ReleaseNotesLink from './ReleaseNotesLink.vue';
import SessionOptions from './SessionOptions.vue';
import HomeLink from './HomeLink.vue';
import WorkflowReportsLink from './WorkflowReportsLink.vue';

const {
  workflowId, title,
} = useWorkflowData();
const {inWorkflow} = useLocation();

const linkTo = inWorkflow ? '#workflow' : '#main';
</script>

<style lang="css" scoped>
:deep(.nuxt-icon svg) {
  width: 1.8rem !important;
  height: 1.8rem !important;
}

a#skiplink {
    position: absolute ;
    left: -100px;
    top: -100px;
    background-color: #ffff !important;
    border:3px solid black !important;
    color: blue;
    }

a#skiplink:focus {
  position: absolute !important;
    left: 400px !important;
    top: 60px !important;
    padding: 3px;
    background-color: #ffff !important;
    border:3px solid black !important;
    }
</style>
