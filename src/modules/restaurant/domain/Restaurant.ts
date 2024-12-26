import { Exclude } from "class-transformer"
import { Point } from "src/modules/restaurant/persistence/custom-type/PointType"
import { UserRole } from "src/modules/user/persistance/User.entity"

export class Restaurant{
    photoUrl: string
    location: Point
}