import { UserEntity } from "../../../user/persistance/User.entity";

export class SendCommentDto{
    user: UserEntity
    roomName: string
    text: string
}