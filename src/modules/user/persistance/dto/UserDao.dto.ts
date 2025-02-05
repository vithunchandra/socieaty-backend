import { UserRole } from "../User.entity";

export interface UserCreateDto{
    name: string
    email: string
    password: string
    phoneNumber: string
    profilePictureUrl?: string
    role: UserRole
}