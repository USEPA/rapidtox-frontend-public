export interface JavaApiResponse<T> {
  _embedded: T;
  _links: {
    self: {
      href: string;
    };
    [key: string]: {
      href: string;
    } | undefined;
  };

}
