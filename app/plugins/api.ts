import AnalogueRepository from '~/api/Analogue/AnalogueRepository';
import BioactivityRepository from '~/api/Bioactivity/BioactivityRepository';
import ChemicalSearchRepository from '~/api/ChemicalSearch/ChemicalSearchRepository';
import HazardRepository from '~/api/Hazard/HazardRepository';
import PhyschemRepository from '~/api/Physchem/PhyschemRepository';
import PODRepository from '~/api/PODRepository/PODRepository';
import ReportRepository from '~/api/Report/ReportRepository';
import SessionRepository from '~/api/Session/SessionRepository';
import RecentSearchRepository from '~/api/ChemicalSearch/RecentSearchRepository';

export interface Repositories {
  session: SessionRepository;
  hazard: HazardRepository;
  bioactivity: BioactivityRepository;
  physchem: PhyschemRepository;
  analogue: AnalogueRepository;
  pod: PODRepository;
  report: ReportRepository;
  chemicalSearch: ChemicalSearchRepository;
  recentSearch: RecentSearchRepository;
}

export default defineNuxtPlugin({
  name: 'api',
  dependsOn: ['fetch'],
  setup() {
    const repositories: Repositories = {
      session: new SessionRepository(),
      bioactivity: new BioactivityRepository(),
      hazard: new HazardRepository(),
      physchem: new PhyschemRepository(),
      analogue: new AnalogueRepository(),
      pod: new PODRepository(),
      report: new ReportRepository(),
      chemicalSearch: new ChemicalSearchRepository(),
      recentSearch: new RecentSearchRepository(),
    };
    return {
      provide: {
        repositories,
      },
    };
  },
});
