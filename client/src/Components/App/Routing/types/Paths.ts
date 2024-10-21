//@ Route pathes
export enum Paths {
  Root = '/',
  NotFound = '*',
  Test = '/test',
  Example = '/example',
  Dashboard = '/dashboard',
  Admin = '/admin',
  //@ `/api` Authentication
  Signup = '/signup',
  Login = '/login',
  Logout = '/logout',
  Users = '/api/users',
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password',
  Documentation = 'https://timewise.gitbook.io/timewise-docs',
}

//@ Route pathes inside the application
export enum PathsDashboard {
  Main = '/dashboard/main',
  Settings = '/dashboard/settings',
  Calendar = '/dashboard/calendar',
  Tasks = '/dashboard/tasks',
  UpdatePassword = '/dashboard/update-password',
  Account = '/dashboard/account',
  PublicUserProfile = '/dashboard/users/:id'
}

//@ Admin Routes
export enum AdminPaths {
  Panel = '/admin/panel',
  Users = '/admin/panel/users',
}
