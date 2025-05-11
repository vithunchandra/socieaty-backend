import { UserEntity } from "../../../user/persistance/user.entity";

export class SendCommentDto{
    user: UserEntity
    roomName: string
    text: string
}