import { UserEntity } from "../../../user/persistance/user.entity"
import { PostCommentEntity } from "../post-comment.entity"

export class LikePostCommentDto{
    comment: PostCommentEntity
    user: UserEntity
}