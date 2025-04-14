import {POD_SECTIONS} from '../constants';
import type {PodSectionName} from '../types';

export const embeddedImg = (encodedImg: string) => `data:image/png;base64,${encodedImg}`;

export const defaultUncertaintyFactorData = [
  {
    title: 'Human Variation (UF<sub>H</sub>)', value: 10, justStatement: '', tooltip: 'This uncertainty factor is applied to account for variations in susceptibility among members of the human population (i.e., inter-individual or intraspecies variability).',
  },
  {
    title: 'Animal to Human Extrapolation (UF<sub>A</sub>)', value: 10, justStatement: '', tooltip: 'This uncertainty factor is applied to account for uncertainty in extrapolating animal data to humans (i.e., interspecies uncertainty).',
  },
  {
    title: 'Subchronic-to-Chronic (UF<sub>S</sub>)', value: 10, justStatement: '', tooltip: 'This uncertainty factor is applied to account for uncertainty in extrapolating from data obtained in a study with less-than-lifetime exposure (i.e., extrapolating from subchronic to chronic exposure duration). ',
  },
  {
    title: 'LOAEL to NOAEL (UF<sub>L</sub>)', value: 10, justStatement: '', tooltip: 'This uncertainty factor is applied to account for uncertainty in extrapolating from a LOAEL rather than from a NOAEL.',
  },
  {
    title: 'Database (UF<sub>D</sub>)', value: 10, justStatement: '', tooltip: 'This uncertainty factor is applied to account for uncertainty(ies) associated with an incomplete hazard and dose-response database.',
  },
];

export const mapDuplicateAndExistingSelections = (section: PodSectionName,
  podIds: (string | number | undefined)[],
  podDataSelected: PodDataTypes[]) => {
  const dupSelections = podDataSelected
    .filter(({section: dupSection, dupRow}) => dupSection.toLowerCase() === section.toLowerCase() && dupRow);
  const otherSectionSelections = podDataSelected
    .filter(({section: otherSection}) => otherSection.toLowerCase() !== section.toLowerCase());
  const updatedDups = dupSelections.filter(({podId}) => (podIds.includes(podId)));

  return {
    otherSectionSelections,
    updatedDups,
  };
};

export const isInVivoSelectable =
(superCategory: string) => [
  SUPER_HAZARD_TYPES.CUSTOM_POD_NAME,
  SUPER_HAZARD_TYPES.POD_NAME,
  SUPER_HAZARD_TYPES.CONVERTED_POD_NAME,
]
  .includes(superCategory);

// Maps selected pod data to uncertainty grid data
export const uncertaintyMapper = (podData: PodDataTypes[]) => {
  return podData.map(pod => ({
    ...pod,
    podValue: pod.section === POD_SECTIONS.IN_VIVO_TOX ?
      (pod as HazardPodDataSelection).toxvalNumeric :
      (pod as AnaloguePodDataSelection).readAcrossValue,
    hazardObj: pod.section === POD_SECTIONS.IN_VIVO_TOX ?
      {
        source: (pod as HazardPodDataSelection).studyType,
        species: (pod as HazardPodDataSelection).speciesCommon,
        criticalEffect: (pod as HazardPodDataSelection).effect,
        exposureRoute: (pod as HazardPodDataSelection).exposureRoute,
        type: (pod as HazardPodDataSelection).toxvalType,
      } :
      {
        source: (pod as AnaloguePodDataSelection).readAcrossSource,
        species: (pod as AnaloguePodDataSelection).readAcrossSpecies,
        exposureRoute: (pod as AnaloguePodDataSelection).readAcrossExpoRoute,
        criticalEffect: (pod as AnaloguePodDataSelection).readAcrossCE,
        type: (pod as AnaloguePodDataSelection).readAcrossType,
      },
  })) as PodUncertaintyData[];
};
