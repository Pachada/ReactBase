export type UserRole = 'admin' | 'user' | 'viewer';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}
