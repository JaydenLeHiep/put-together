export type User = {
  id: string;
  userName: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Student';
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
  roleName: "Admin" | "Teacher" | "Student";
  createdAt: string;
};

export type UserRegisterRequest = {
    identifier: string;
    password: string;
};