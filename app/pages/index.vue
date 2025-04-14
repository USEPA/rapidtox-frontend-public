<script setup lang="ts">
import {
  Workflow, type SessionModalProps, type AvailableWorkflow,
} from '~/components/workflowSections/workflowReports/workflowConstants';
import SessionalModal from '~/components/workflowSections/session/SessionModal.vue';
import DisplayWorkflowSection from '~/components/layout/UI/home/DisplayWorkflowSection.vue';
import LiabilityDisclaimerDialog from '~/components/layout/UI/Dialog/LiabilityDisclaimerDialog.vue';

const sessionStore = useSessionStore();
const {sessionRecallFailed, hasAcceptedLiabilityDialog} = storeToRefs(sessionStore);
const {
  $patch: sessionPatch, setPreviousUserSessions: fillPreviousUserSessions, resetSessionStore,
} = sessionStore;
const showSessionsCreationModal = (showSessionCreationModal: boolean) => sessionPatch({showSessionCreationModal});
const clearSessionId = (sessionId: string) => sessionPatch({sessionId});

const emergencyRespText = ref('The Emergency Response workflow provides hazard data associated with acute and short-term exposure durations, as well as physicochemical and environmental fate and transport properties. The outputs are targeted for decision-making on the order of hours to days.');

const humanHealthText = ref('The Human Health Assessment workflow provides hazard data associated with subchronic and chronic exposure durations, as well as physicochemical and environmental fate and transport properties. The outputs are targeted for screening of chemicals across environmental media for a given site or geographic location.');

const mixtureAssessmentText = ref('The Mixture Assessment workflow collects and arrays hazard data associated with co-occurring chemicals, as well as exposure, physicochemical and environmental fate and transport properties. The outputs are targeted at evaluation of mixture chemicals under assumptions of dose, response, or integrated addition.');

const screeningLevelAssessmentText = computed(() => {
  return sessionRecallFailed.value ? 'Human Health Assessment is not available at this time. please try again later' : humanHealthText.value;
});

const emergencyResponseText = computed(() => {
  return sessionRecallFailed.value ? 'Emergency Response Workflow is not available at this time. please try again later' : emergencyRespText.value;
});

const loading = ref(true);

onMounted(async() => {
  try {
    resetSessionStore();
    await fillPreviousUserSessions();
    clearSessionId('');
  } finally {
    loading.value = false;
  }
});

onBeforeMount(() => {
  sessionPatch({showSessionCreationModal: false});
});

const workflow = ref<SessionModalProps>({
  workflowId: 'hha',
  description: '',
  title: '',
  redirectUrl: '',
  stylesheet: '',
});

const availableWorkflows = ref<AvailableWorkflow[]>([
  {
    workflowId: 'er',
    cypressTag: 'EmergencyResponseWF',
    altImgText: 'Emergency response image',
    imageSrc: './available-workflows/emergency-response.png',
    captionClass: 'erFigCaption',
    description: emergencyResponseText,
    title: 'Emergency Response',
    comingSoon: false,
  },
  {
    workflowId: 'hha',
    cypressTag: 'HumanHealthAssessmentWF',
    altImgText: 'human-health-assessment image',
    imageSrc: './available-workflows/human-health-assessment.png',
    captionClass: 'hhaFigCaption',
    description: screeningLevelAssessmentText,
    title: 'Human Health Assessment',
    comingSoon: false,
  },
  {
    workflowId: 'ma',
    cypressTag: 'MixtureAssessmentWF',
    altImgText: 'mixture-assessment image',
    imageSrc: './available-workflows/mixture-assessment.png',
    captionClass: 'mixtureFigCaption',
    description: mixtureAssessmentText.value,
    title: 'Mixture Assessment',
    comingSoon: true,
  },
]);

const goToWorkflow = (wfVal: string) => {
  if (wfVal === 'hha') {
    workflow.value = Workflow.ScreeningLevelAssessment as SessionModalProps;
    showSessionsCreationModal(true);
  }
  if (wfVal === 'er') {
    workflow.value = Workflow.EmergencyResponse as SessionModalProps;
    showSessionsCreationModal(true);
  }
  if (sessionRecallFailed.value || loading.value) {
    showSessionsCreationModal(false);
  }
  // NOTE: Navigation is controlled from store/session/actions.js now.
};

// Liability Dialog
const acceptLiabilityDialog = () => {
  hasAcceptedLiabilityDialog.value = true;
};
</script>

<template>
  <NuxtLayout name="epa">
    <SessionalModal :workflow="workflow" />
    <LiabilityDisclaimerDialog
      :show="!hasAcceptedLiabilityDialog"
      data-cy="DisclaimerModal"
      @close-dialog="acceptLiabilityDialog"
    />
    <main
      id="main"
      class="container-fluid main-content px-0"
    >
      <client-only>
        <div
          class="row justify-content-center top-workflows-row"
        >
          <div class="col">
            <h1 class="page-title">
              Available Workflows
            </h1>
          </div>
        </div>
        <div
          class="row justify-content-center top-workflows-images-row"
        >
          <!-- Remove filter to add mixture assesment back.' -->
          <div
            v-for="workflowItem in availableWorkflows.filter(item => item.workflowId !== 'ma')"
            :key="workflowItem.workflowId"
            class="col-sm-12 col-md-11 col-lg-4 col-xl-3"
          >
            <DisplayWorkflowSection
              :loading="loading"
              :session-recall-failed="sessionRecallFailed"
              :workflow-item="workflowItem"
              :go-to-workflow="goToWorkflow"
            />
          </div>
          <span
            class="text-center mt-4 col-sm-12"
            data-cy="contactText"
          > Please contact Jason Lambert
            (<a
              class="text-primary"
              href="mailto:jason.lambert@epa.gov?subject=RapidTox%20Comment"
            >jason.lambert@epa.gov</a>),
            the RapidTox Project Lead, if you have any questions or comments. </span>
        </div>
      </client-only>
    </main>
  </NuxtLayout>
</template>

<style scoped>
.page-title {
  margin-top: 5px;
  font-weight: 600;
  padding: 20px 0px 30px 0px;
}

.top-workflows-images-row {
  margin-top: 25px;
  padding-bottom: 100px;
}

.top-workflows-row {
  margin-top: 25px;
}
</style>
