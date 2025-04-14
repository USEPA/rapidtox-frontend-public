declare module '#auth-utils' {
  interface User {
    // Add your own fields
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;

  }

  interface UserSession {
    // Add your own fields
  }
}

export {};
