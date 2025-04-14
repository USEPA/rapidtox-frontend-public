import type {SnackBarMsg} from './types';
import type {Workflow} from '~~/types';
import type {PreviousSession, SessionResponse} from '~/api/Session/types';

export const useSessionStore = defineStore('session', () => {
  /* Session Modal */
  const previousUserSessions: Ref<PreviousSession[]> = ref([]);
  const sessionWorkflowType = ref<Workflow>('home');
  const sessionId = ref('');
  const sessionTitle = ref('');
  const updatedDate = ref('');
  const createdDate = ref('');
  const hasAcceptedLiabilityDialog = ref(false);

  const setPreviousUserSessions = async() => {
    try {
      const {$repositories} = useNuxtApp();
      const previousSessions = await $repositories.session.getUserPreviousSessions();
      sessionRecallFailed.value = false;
      previousUserSessions.value = previousSessions;
      return previousSessions;
    } catch {
      sessionRecallFailed.value = true;
    }
  };

  // Create Session
  const sessionCreationFailed = ref(false);
  const isCreatingSession = ref(false);
  const showSessionCreationModal = ref(false);

  const createUserSession = async(data: CreateSessionParams) => {
    try {
      const {resetWorkflowState, $patch} = useAppBaseStore();
      resetWorkflowState();
      const {$repositories, $router} = useNuxtApp();
      const {user} = useOidcAuth();
      isCreatingSession.value = true;
      const {sessionTitle: incomingSessionTitle} = data;
      const {workflow} = data;
      const username = user?.value?.claims?.email as string;
      // const username = user?.value?.preferred_username as string;
      const newSession = await $repositories.session.createUserSession({
        sessionTitle: incomingSessionTitle, username, workflow,
      });
      const originalSessionKey = newSession.sessionKey.trim();

      sessionWorkflowType.value = workflow;
      sessionId.value = originalSessionKey;
      sessionTitle.value = newSession.sessionTitle.trim();
      updatedDate.value = newSession.updateTimestamp.trim();
      createdDate.value = newSession.createTimestamp.trim();

      // Only redirect if creating session from outside workflow
      if (!useLocation().inWorkflow) {
        $router.push({
          path: data.redirectUrl,
          query: {fromHome: true},
        });
      }

      triggerSessionToast('Session successfully created.');
      showSessionCreationModal.value = false;
      resetModal();
      $patch({activeTab: 'chemSearch'});
    } catch (e) {
      sessionCreationFailed.value = true;
      throw e;
    } finally {
      isCreatingSession.value = false;
    }
  };

  // Edit Session
  const sessionEditFailed = ref(false);

  const editUserSession = async(sessionObject: PreviousSession) => {
    try {
      const {$repositories} = useNuxtApp();
      await $repositories.session.renameSession(sessionObject, sessionObject.sessionKey);
      const updatedUserSessions = previousUserSessions.value
        .filter(session => session.sessionKey !== sessionObject.sessionKey);
      updatedUserSessions.push(sessionObject);
      previousUserSessions.value = updatedUserSessions;
      sessionEditFailed.value = false;
      return updatedUserSessions;
    } catch (e) {
      sessionEditFailed.value = true;
      throw e;
    }
  };

  // Load Session
  const isSessionLoading = ref(false);
  const sessionRecallFailed = ref(false);
  const sessionLoadFailed = ref(false);

  const loadUserSession = async({
    sessionKey, redirectUrl = '',
  }: {
    sessionKey: string;
    redirectUrl?: string;
    shouldRedirect?: boolean;
  }) => {
    try {
      const {resetWorkflowState, $patch} = useAppBaseStore();
      resetWorkflowState();
      const {$repositories, $router} = useNuxtApp();
      const {loadAnalogueSession} = useAnalogueStore();
      const {loadBioActivitySession} = useBioactivityStore();
      const {loadHazardSession} = useHazardStore();
      const {loadEnvFateSession} = useEnvFateStore();
      const {loadPhyschemSession} = usePhyschemStore();
      const {loadPodSession} = usePodStore();
      const {loadReportSession} = useReportStore();
      const {loadChemicalSearchSession} = useChemicalSearchStore();
      isCreatingSession.value = true;

      const previousSession = await $repositories.session.loadUserSession(sessionKey);
      sessionId.value = previousSession.sessionKey.trim();
      sessionWorkflowType.value = previousSession.workflow;
      sessionTitle.value = previousSession.sessionTitle.trim();
      updatedDate.value = previousSession.updateTimestamp.trim();
      createdDate.value = previousSession.createTimestamp.trim();
      const physchemSessionData = previousSession.physchem ? JSON.parse(previousSession.physchem) : '';
      const envFateSessionData = previousSession.envFate ? JSON.parse(previousSession.envFate) : '';
      const chemicalSearchSessionData = previousSession.chemicalSearch ? JSON.parse(previousSession.chemicalSearch) : '';
      const hazardSessionData = previousSession.hazard ? JSON.parse(previousSession.hazard) : '';
      const podSessionData = previousSession.pod ? JSON.parse(previousSession.pod) : '';
      const reportSessionData = previousSession.report ? JSON.parse(previousSession.report) : '';
      const bioActivitySessionData = previousSession.bioactivity ? JSON.parse(previousSession.bioactivity) : '';
      const analogueSessionData = previousSession.analogue ? JSON.parse(previousSession.analogue) : '';
      const {activeTab} = previousSession;
      loadAnalogueSession(analogueSessionData);
      loadChemicalSearchSession(chemicalSearchSessionData);
      loadHazardSession(hazardSessionData);
      loadPhyschemSession(physchemSessionData);
      loadEnvFateSession(envFateSessionData);
      loadPodSession(podSessionData);
      loadBioActivitySession(bioActivitySessionData);
      loadReportSession(reportSessionData);

      // Only redirect if loading session from outside workflow
      if (!useLocation().inWorkflow) {
        $router.push({
          path: redirectUrl,
          query: {fromHome: 'true'},
        });
      }
      $patch({activeTab});
      triggerSessionToast('Session successfully loaded.');

      return activeTab;
    } catch (e) {
      sessionLoadFailed.value = true;
      throw e;
    } finally {
      isCreatingSession.value = false;
      resetModal();
    }
  };

  // Delete Session
  const sessionDeleteFailed = ref(false);

  const deleteUserSession = async(sessionKey: string) => {
    try {
      const {$repositories} = useNuxtApp();

      await $repositories.session.deleteSession(sessionKey);
      const updatedSessionList = previousUserSessions.value.filter(session => session.sessionKey !== sessionKey);
      previousUserSessions.value = updatedSessionList;
      sessionDeleteFailed.value = false;
    } catch {
      sessionDeleteFailed.value = true;
    }
  };

  const resetModal = (loadCreating = true) => {
    sessionCreationFailed.value = false;
    sessionLoadFailed.value = false;
    sessionDeleteFailed.value = false;
    sessionEditFailed.value = false;
    if (!loadCreating) {
      isCreatingSession.value = false;
    }
  };

  // Save Session
  const saveSession = async(activeTab: TabKey, msg?: SnackBarMsg) => {
    const toastMsg: SnackBarMsg = msg || 'Your session has been saved.';
    const response = await buildSessionObj(activeTab) as SessionResponse;
    if (response && response.chemicalSearch) {
      const {loadChemicalSearchSession} = useChemicalSearchStore();
      loadChemicalSearchSession(JSON.parse(response.chemicalSearch));
    }
    triggerSessionToast(toastMsg);
  };

  const buildSessionObj = async(activeTab: TabKey) => {
    const {$repositories} = useNuxtApp();
    const {user} = useOidcAuth();
    //  const {user} = useUserSession();
    const {$state: analogueStoreState} = useAnalogueStore();
    const {$state: bioActivityStoreState} = useBioactivityStore();
    const {$state: hazardStoreState} = useHazardStore();
    // eslint-disable-next-line no-unused-vars
    const {hazardApiResponse, ...hazardStoreStateWithoutApiRes} = hazardStoreState;
    const {$state: envStoreState} = useEnvFateStore();
    const {$state: physchemStoreState} = usePhyschemStore();
    const {$state: podStoreState} = usePodStore();
    const {$state: reportStoreState} = useReportStore();
    const {$state: chemicalSearchStoreState} = useChemicalSearchStore();
    const {sessionId: id} = useSessionStore();

    const sessionObj = {
      username: user?.value?.claims?.email as string,
      activeTab: activeTab,
      chemicalSearch: JSON.stringify(chemicalSearchStoreState),
      hazard: JSON.stringify(hazardStoreStateWithoutApiRes),
      physchem: JSON.stringify(physchemStoreState),
      envFate: JSON.stringify(envStoreState),
      analogue: JSON.stringify(analogueStoreState),
      bioactivity: JSON.stringify(bioActivityStoreState),
      pod: JSON.stringify(podStoreState),
      report: JSON.stringify(reportStoreState),

    };
    const session = await $repositories.session.updateSession(sessionObj, id);
    return session;
  };

  // Session Toast
  const showSessionSnackbar = ref(false);
  const sessionSnackbarMsg = ref<SnackBarMsg>('');
  const sessionSnackBarContentClass = ref('session-snackbar-content-class');

  const triggerSessionToast = (msg: SnackBarMsg) => {
    sessionSnackbarMsg.value = msg;
    showSessionSnackbar.value = true;
  };

  // Reset
  const resetSessionStore = () => {
    previousUserSessions.value = [];
    sessionWorkflowType.value = 'home';
    sessionId.value = '';
    sessionTitle.value = '';
    updatedDate.value = '';
    createdDate.value = '';
    sessionCreationFailed.value = false;
    isCreatingSession.value = false;
    showSessionCreationModal.value = false;
    sessionEditFailed.value = false;
    isSessionLoading.value = false;
    sessionRecallFailed.value = false;
    sessionLoadFailed.value = false;
    sessionDeleteFailed.value = false;
  };

  return {
    previousUserSessions,
    sessionWorkflowType,
    sessionId,
    sessionTitle,
    updatedDate,
    createdDate,
    sessionCreationFailed,
    isCreatingSession,
    showSessionCreationModal,
    sessionEditFailed,
    isSessionLoading,
    sessionRecallFailed,
    sessionLoadFailed,
    sessionDeleteFailed,
    setPreviousUserSessions,
    createUserSession,
    resetModal,
    deleteUserSession,
    editUserSession,
    loadUserSession,
    triggerSessionToast,
    sessionSnackBarContentClass,
    showSessionSnackbar,
    sessionSnackbarMsg,
    hasAcceptedLiabilityDialog,
    resetSessionStore,
    saveSession,
  };
}, {persist: true});

// export default useSessionStore;
