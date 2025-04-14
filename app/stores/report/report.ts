export const useReportStore = defineStore('report', () => {
  // Report session data
  const hasVisited = ref(false);

  const resetReport = () => {
    hasVisited.value = false;
  };

  const loadReportSession = (sessionData: {
    hasVisited: boolean;
  }) => {
    hasVisited.value = sessionData.hasVisited || false;
  };

  // Generate Report
  const showReportModal = ref(false);
  const isProcessingReport = ref(false);

  return {
    hasVisited,
    resetReport,
    loadReportSession,
    showReportModal,
    isProcessingReport,
  };
});
