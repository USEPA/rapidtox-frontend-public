/* eslint-disable no-unused-vars */
import type {Workflow} from './types';
import type {Repositories} from '~/plugins/api';

declare module '#app' {
  interface NuxtApp {
    $repositories: Repositories;
    $apiFetch: (fetchOptions: FetchOptions) => $Fetch<unknown, NitroFetchRequest>;
    $router: VueRouter;
  }
}
declare module 'vue-axe';

// declare module 'vue' {
//   interface ComponentCustomProperties {
//   }
// }

export {};
