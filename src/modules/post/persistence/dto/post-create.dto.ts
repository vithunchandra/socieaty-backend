import { Point } from "src/modules/restaurant/persistence/custom-type/PointType"
import { UserEntity } from "src/modules/user/persistance/User.entity"

export class PostCreateDto{
    title: string
    caption: string
    location?: Point
    user: string
}