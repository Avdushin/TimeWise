//@ Enum of the API URLS

// export const API_URL: string = 'http://localhost:4000';

export enum API {
	//@ Authorization
  SignUP = '/api/signup',
  Login = '/api/login',
  ForgotPassword = '/api/forgot-password',
  ResetPassword = '/api/reset-password',
  Logout = '/api/logout',
	//@ Users
	Users = '/api/users',
	UserID = '/api/users/:id',
	UserUpdate = '/api/users/update',
	UserUpdateRole = '/users/update-role/:id',
}
