<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {AvailableWorkflow} from '~/components/workflowSections/workflowReports/workflowConstants';

const props = defineProps<{
  workflowItem: AvailableWorkflow;
  sessionRecallFailed: boolean;
  loading: boolean;
  goToWorkflow: (wfVal: string) => void;
}>();

const getImageClass = computed(() => {
  if (props.loading) {
    return 'workflow-image-disabled';
  }
  if (props.sessionRecallFailed) {
    return 'workflow-image-error';
  }
  return 'workflow-image';
});

const getTabIndex = computed(() => {
  if (props.loading) {
    return -1;
  }
  if (props.sessionRecallFailed) {
    return -1;
  }
  return 0;
});

const getDisabled = computed(() => {
  if (props.loading) {
    return true;
  }
  if (props.sessionRecallFailed) {
    return true;
  }
  return false;
});
</script>

<template>
  <section
    v-if="!props.workflowItem.comingSoon"
    :id="props.workflowItem.workflowId"
    :class="getImageClass"
    :data-cy="props.workflowItem.cypressTag"
    :disabled="getDisabled"
    :tabindex="getTabIndex"
    @click="props.goToWorkflow(props.workflowItem.workflowId)"
    @keyup.enter="props.goToWorkflow(props.workflowItem.workflowId)"
  >
    <figure :class="getImageClass">
      <Spinner
        v-if="props.loading"
        width="200"
        height="200"
        caption-msg="Loading..."
      />
      <img
        v-else
        :id="`${props.workflowItem.workflowId}-fig`"
        :data-cy="`${props.workflowItem.workflowId}Fig`"
        :class="getImageClass"
        class="img-fluid"
        :alt="props.workflowItem.altImgText"
        :src="props.workflowItem.imageSrc"
      >
      <figcaption
        :class="props.workflowItem.captionClass"
        :data-cy="`${props.workflowItem.workflowId}FigCaption`"
      >
        {{ props.workflowItem.title }}
      </figcaption>
    </figure>

    <div
      :class="getImageClass"
      class="card p-0"
    >
      <div class="card-body">
        <p class="card-text">
          {{ props.workflowItem.description }}
        </p>
      </div>
    </div>
  </section>
  <section
    v-if="props.workflowItem.comingSoon === true"
    :id="props.workflowItem.workflowId"
    :class="getImageClass"
    class="grey-out"
    :data-cy="props.workflowItem.cypressTag"
    :disabled="getDisabled"
    :tabindex="getTabIndex"
  >
    <div
      v-if="props.workflowItem.comingSoon"
      class="coming-soon text-center position-absolute m-auto grey-out"
    >
      Coming Soon
    </div>
    <figure :class="getImageClass">
      <img
        :id="`${props.workflowItem.workflowId}-fig`"
        :data-cy="`${props.workflowItem.workflowId}Fig`"
        :class="getImageClass"
        class="img-fluid grey-out"
        :alt="props.workflowItem.altImgText"
        :src="props.workflowItem.imageSrc"
      >
      <figcaption
        class="grey-out"
        :class="props.workflowItem.captionClass"
        :data-cy="`${props.workflowItem.workflowId}FigCaption`"
      >
        Mixture Assessment
      </figcaption>
    </figure>
    <div
      class="card"
    >
      <div class="card-body">
        <p class="card-text">
          {{ props.workflowItem.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card-text {
  font-size: .9rem !important;
}
 .workflow-image {
  cursor: pointer;
}

.workflow-image-disabled {
  cursor: progress;
}

.workflow-image-error {
  cursor: not-allowed;
}
img .workflow-image {
  padding: 5px;
  cursor: pointer;
  object-fit: cover;
}

img .workflow-image-disabled {
  padding: 5px;
  cursor: progress;
  object-fit: cover;
}

img .workflow-image-error {
  padding: 5px;
  cursor: not-allowed;
  object-fit: cover;
}
.figcaption-disabled {
  text-align: center !important;
  font-size: 20px;
  background-color: grey;
  border-top: solid 1px black;
  color: white;
}

figcaption {
  text-align: center !important;
  font-size: 20px;
  border-top: solid 1px black;
  color: white;
}

.hhaFigCaption  {
  background-color: #0071bc !important;
}

.erFigCaption {
  background-color: #190182 !important;
}

.mixtureFigCaption {
  background-color: magenta !important;
}

figure {
  border: solid 1px black;
}
.grey-out {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  filter: grayscale(100%);
  cursor: help !important;
}

.grey-out-available {
  -webkit-filter: grayscale(70%);
  -moz-filter: grayscale(70%);
  -o-filter: grayscale(70%);
  -ms-filter: grayscale(70%);
  filter: grayscale(70%);
  cursor: help !important;
}

.loading-image-home {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-filter: grayscale(0);
  -moz-filter: grayscale(0);
  -o-filter: grayscale(0);
  -ms-filter: grayscale(0);
  filter: grayscale(0);
  width: 50%;
  height: 50%;
  z-index: 10;
}

.coming-soon {
  position: absolute;
  top: 20%;
  text-shadow: 0px 0px 7px #000000;
  font-size: 40px;
  width: 100% !important;
  z-index: 10;
  color: white;
}
</style>
