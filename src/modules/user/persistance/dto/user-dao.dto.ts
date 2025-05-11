import { UserRole } from "../user.entity";

export interface UserCreateDto{
    name: string
    email: string
    password: string
    phoneNumber: string
    profilePictureUrl?: string
    role: UserRole
}