import { UserEntity } from "../../../user/persistance/User.entity"
import { PostEntity } from "../post.entity"

export class LikePostDto{
    post: PostEntity
    user: UserEntity
}