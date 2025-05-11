import { User } from "../../user/domain/user"

export class LivestreamRoomComment{
    id: string
    roomName: string
    user: User
    text: string
}