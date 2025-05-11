import { User } from "../../user/domain/user"

export class PostComment{
    id: string
    postId: string
    author: User
    userId: string
    text: string
    likes?: User[]
}