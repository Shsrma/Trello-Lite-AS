// frontend/src/types/user.d.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
