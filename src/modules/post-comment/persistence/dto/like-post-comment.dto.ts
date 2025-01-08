import { UserEntity } from "../../../user/persistance/User.entity"
import { PostCommentEntity } from "../post-comment.entity"

export class LikePostCommentDto{
    comment: PostCommentEntity
    user: UserEntity
}