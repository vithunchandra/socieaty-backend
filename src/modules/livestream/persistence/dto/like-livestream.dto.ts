import { UserEntity } from "../../../user/persistance/User.entity"

export class LikeLivestreamDto{
    roomName: string
    user: UserEntity
}