import { PostCommentEntity } from "../persistence/post-comment.entity";
import { PostComment } from "./post-comment";

export class PostCommentMapper{
    static toDomain(raw: PostCommentEntity): PostComment {
        const postComment = new PostComment()
        postComment.post_id = raw.post.id
        postComment.user_name = raw.user.name
        postComment.text = raw.text
        postComment.likes = raw.likes

        return postComment
    }
}