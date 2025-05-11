import { UserEntity } from "../../../user/persistance/user.entity"
import { PostEntity } from "../post.entity"

export class LikePostDto{
    post: PostEntity
    user: UserEntity
}