import { UserRole } from "../User.entity";

export interface UserCreateDto{
    email: string
    password: string
    phoneNumber: string;
    role: UserRole
}