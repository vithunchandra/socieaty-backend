import { UserRole } from "../User.entity";

export interface UserCreateDto{
    name: string
    email: string
    password: string
    phoneNumber: string
    role: UserRole
}