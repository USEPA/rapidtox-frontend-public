export const useLocation = () => {
  const router = useRoute();

  const locations = {
    inWorkflow: (router.path === '/emergency-response' || router.path === '/human-health-assessment'),
    isWorkflowReports: (router.path === '/workflow-reports'),
    isHome: (router.path === '/'),
    isReleaseNotes: (router.path === '/release'),
  };

  return locations;
};
