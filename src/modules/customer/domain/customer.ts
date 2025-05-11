import { Exclude } from "class-transformer"
import { UserRole } from "src/modules/user/persistance/user.entity"

export class Customer{
    id: string
    wallet: number
    bio: string
}