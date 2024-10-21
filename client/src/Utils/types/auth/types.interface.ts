export interface UserData {
  id: number;
  auth: {
    username: string;
    email: string;
    password?: string;
    role: string;
  };
  personal: {
    name: string;
    surname: string;
    patronymic: string;
    birthday: string;
    phone: string;
  };
  location: {
    country: string;
    city: string;
  };
  tasks: Task[];
  events: Event[];
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  is_completed: boolean;
  due_date?: string;
}

export interface Event {
  id: number;
  user_id: number;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
}

export interface AuthValues {
  username: string;
  email: string;
  password: string;
}
export interface PersonalValues {
  name: string;
  surname: string;
  patronymic: string;
  birthday: string;
  phone: string;
}
export interface LocationValues {
  country: string;
  city: string;
}

export interface SignupFormValues {
  Auth: AuthValues;
  Personal: PersonalValues;
  Location: LocationValues;
  position: string;
}

export type LoginValues = Pick<AuthValues, "email" | "password">;

export interface LoginFormValues {
  Auth: LoginValues;
}
