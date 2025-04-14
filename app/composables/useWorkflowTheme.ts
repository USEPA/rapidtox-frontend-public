import {Workflow, type SessionModalProps} from '~/components/workflowSections/workflowReports/workflowConstants';

export const useWorkflowData = (): Omit<SessionModalProps, 'shouldRedirect'> => {
  const {path} = useNuxtApp().$router.currentRoute.value;

  const baseObj: Omit<SessionModalProps, 'shouldRedirect'> = {
    workflowId: 'home',
    title: '',
    description: '',
    redirectUrl: '',
    stylesheet: '',
  };

  const findData = Object.keys(Workflow).find(workflow => Workflow[workflow]?.redirectUrl === path);
  if (findData) {
    return Workflow[findData] || baseObj;
  }
  return baseObj;
};
