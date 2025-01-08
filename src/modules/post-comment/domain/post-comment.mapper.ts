import { PostCommentEntity } from "../persistence/post-comment.entity";
import { PostComment } from "./post-comment";

export class PostCommentMapper{
    static toDomain(raw: PostCommentEntity): PostComment {
        const postComment = new PostComment()
        postComment.postId = raw.post.id
        postComment.userName = raw.user.name
        postComment.text = raw.text
        postComment.likes = raw.commentLikes.count()

        return postComment
    }
}