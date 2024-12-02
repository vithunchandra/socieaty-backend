import { Exclude } from "class-transformer"
import { Point } from "src/modules/restaurant/persistence/custom-type/PointType"
import { UserRole } from "src/modules/user/persistance/User.entity"

export class Restaurant{
    id: string
    name: string
    photoUrl: string
    location: Point
    email: string
    phoneNumber: string
    @Exclude()
    password: string
    role: UserRole
}