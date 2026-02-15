export const ROLE_VALUES = ["Admin", "Teacher", "Student"] as const;
export type RoleName = (typeof ROLE_VALUES)[number];

export type User = {
  id: string;
  userName: string;
  email: string;
  role: RoleName;
  createdAt: string;
};

export type UserInfo = {
  id: string;
  userName: string;
  email: string;
  roleName: string; 
};

export type UserReadDto = {
  id: string;
  userName: string;
  email: string;
  roleName: RoleName;
  createdAt: string;
};

export type UserRegisterRequest = {
  identifier: string;
  password: string;
};