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