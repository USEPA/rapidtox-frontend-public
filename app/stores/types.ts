export type TabKey = 'chemSearch' | 'chemSearchResults' | 'physChem' | 'envFate' | 'hazard' | 'analogue' | 'bioAct' | 'pod' | 'report';

export interface Tab {
  tabKey: TabKey;
  tabDisplayName: string;
  stepperIcon: string;
}

export interface SnackbarType {
  contentClass: string;
}
