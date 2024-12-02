import { Exclude } from "class-transformer"
import { UserRole } from "../persistance/User.entity"

export class User{
    id: string
    email: string
    @Exclude({toPlainOnly: true})
    password: string
    phoneNumber: string
    role: UserRole
}