export interface UserData {
  id: string;
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  birthdate: string;
  phone?: string;
  country?: string;
  city?: string;
}


export interface AuthValues {
  username: string;
  email: string;
  password: string;
}

export interface PersonalValues {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  birthdate: string;
  phone?: string;
}

export interface LocationValues {
  country?: string;
  city?: string;
}

export interface SignupFormValues {
  Auth: AuthValues;
  Personal: PersonalValues;
  Location: LocationValues;
}

// export type LoginValues = Pick<AuthValues, "email" | "password">;
export interface LoginValues {
  email: string;
  password: string;
}


export interface LoginFormValues {
  email: string;
  password: string;
}