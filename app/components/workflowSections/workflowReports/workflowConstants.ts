import type {Workflow as WorkflowType} from '~~/types';

export interface SessionModalProps {
  workflowId: WorkflowType;
  title: string;
  description: string;
  redirectUrl: string;
  stylesheet: string;
}

export interface AvailableWorkflow {
  workflowId: string;
  cypressTag: string;
  captionClass: string;
  title: string;
  altImgText: string;
  imageSrc: string;
  description: ComputedRef | string;
  comingSoon: boolean;
}

export const Workflow: {
  [key: string]: Omit<SessionModalProps, 'shouldRedirect'>;
} = {
  ScreeningLevelAssessment: {
    workflowId: 'hha',
    description: 'All things related to human health assessments.',
    title: 'Human Health Assessment',
    redirectUrl: '/human-health-assessment',
    stylesheet: 'human-health-assessment.css',
  },
  EmergencyResponse: {
    workflowId: 'er',
    description: 'All things related to emergency response',
    title: 'Emergency Response',
    redirectUrl: '/emergency-response',
    stylesheet: 'emergency-response.css',
  },
  MixtureAssessment: {
    workflowId: 'ma',
    description: 'All things related to mixture assessments',
    title: 'Mixture Assessment',
    redirectUrl: '/mixture-assessment',
    stylesheet: 'mixture-assessment-response.css',
  },
};

export const Symbols = {
  er: Workflow.EmergencyResponse,
  ma: Workflow.MixtureAssessment,
  hha: Workflow.ScreeningLevelAssessment,
};
