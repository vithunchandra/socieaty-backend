import { User } from "../../user/domain/User"

export class PostComment{
    id: string
    postId: string
    author: User
    userId: string
    text: string
    likes?: User[]
}