import { UserEntity } from "../../../user/persistance/user.entity"

export class LikeLivestreamDto{
    roomName: string
    user: UserEntity
}