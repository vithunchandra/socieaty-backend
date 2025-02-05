import { Exclude } from "class-transformer"
import { UserRole } from "src/modules/user/persistance/User.entity"

export class Customer{
    wallet: number
    bio: string
}