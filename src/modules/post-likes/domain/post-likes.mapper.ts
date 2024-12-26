import { PostLikeEntity } from "../persistence/post-like.entity";
import { PostLikes } from "./post-likes";

export class PostLikesMapper{
    static toDomain(raw: PostLikeEntity): PostLikes {
        const postLikes = new PostLikes()
        postLikes.post_id = raw.post.id
        postLikes.user_id = raw.user.id
        postLikes.user_name = raw.user.name

        return postLikes
    }
}