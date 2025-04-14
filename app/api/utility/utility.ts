import type {FetchContext, ResponseType} from 'ofetch';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addBearerToRequest = async(context: FetchContext<any, ResponseType>) => {
  const {fetch, refresh} = useOidcAuth();
  await fetch();
  const {user} = useOidcAuth();
  let accessToken = user.value?.accessToken;

  /**
   * If token is currently refreshing, retry/wait for new tokens
   * TODO: Remove this when issue is fixed in library - https://github.com/itpropro/nuxt-oidc-auth/issues/84
  */
  let count = 0;
  while (!accessToken && count <= 5 && user.value?.canRefresh) {
    accessToken = useOidcAuth().user.value?.accessToken;
    count += 1;
    // eslint-disable-next-line no-await-in-loop
    await refresh();
  }
  if (accessToken) {
    context.options.headers.append('Authorization', `Bearer ${accessToken}`);
  }
};
