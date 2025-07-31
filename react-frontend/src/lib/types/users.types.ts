export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone?: string;
  needWheelchairAccessibleRoom?: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type UserCreating = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  needWheelchairAccessibleRoom?: boolean;
};

export type UserUpdating = Partial<Omit<UserCreating, "role">>;
