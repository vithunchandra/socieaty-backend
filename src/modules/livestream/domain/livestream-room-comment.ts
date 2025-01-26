import { User } from "../../user/domain/User"

export class LivestreamRoomComment{
    id: string
    roomName: string
    user: User
    text: string
}