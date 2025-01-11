import { User } from "../../user/domain/User"

export class PostComment{
    id: string
    postId: string
    userName: string
    text: string
    likes?: User[]
}