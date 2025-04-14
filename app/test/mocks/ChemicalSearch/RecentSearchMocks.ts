import {userNameMock} from '~/test/mocks/UserMocks';
import {BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import type {RecentSearch} from '~/api/ChemicalSearch/types';

export const getRecentChemicalSearchesMock: RecentSearch[] = [
  {
    id: 17587,
    userName: userNameMock,
    searchText: BisphenolASelectedChemicalMock.dtxsid,
    searchedOn: '2024-12-20T21:32:13.897308Z',
  }, {
    id: 17570,
    userName: userNameMock,
    searchText: BisphenolASelectedChemicalMock.dtxsid,
    searchedOn: '2024-12-17T19:04:25.535009Z',
  }, {
    id: 17472,
    userName: userNameMock,
    searchText: BisphenolASelectedChemicalMock.dtxsid,
    searchedOn: '2024-11-26T22:22:54.191883Z',
  }, {
    id: 17464,
    userName: userNameMock,
    searchText: BisphenolASelectedChemicalMock.dtxsid,
    searchedOn: '2024-11-20T20:03:13.826846Z',
  }, {
    id: 17443,
    userName: userNameMock,
    searchText: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolASelectedChemicalMock.dtxsid}`,
    searchedOn: '2024-11-14T23:41:17.791821Z',
  }, {
    id: 17442,
    userName: userNameMock,
    searchText: BisphenolASelectedChemicalMock.dtxsid,
    searchedOn: '2024-11-14T23:40:25.268048Z',
  }, {
    id: 17441,
    userName: userNameMock,
    searchText: BisphenolASelectedChemicalMock.dtxsid,
    searchedOn: '2024-11-14T23:32:32.115366Z',
  }, {
    id: 17440,
    userName: userNameMock,
    searchText: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`,
    searchedOn: '2024-11-14T22:38:36.945066Z',
  }, {
    id: 17439,
    userName: userNameMock,
    searchText: BisphenolASelectedChemicalMock.dtxsid,
    searchedOn: '2024-11-14T22:10:08.880959Z',
  },
];
