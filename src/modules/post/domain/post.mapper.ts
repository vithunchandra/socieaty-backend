import { PostComment } from "../../post-comment/domain/post-comment"
import { PostCommentMapper } from "../../post-comment/domain/post-comment.mapper"
import { PostLikesMapper } from "../../post-likes/domain/post-likes.mapper"
import { PostMediaMapper } from "../../post-media/domain/post-media.mapper"
import { PostEntity } from "../persistence/post.entity"
import { Post } from "./post"

export class PostMapper{
    static toDomain(raw: PostEntity | null): Post | null{
        if(!raw) return null

        const post = new Post()

        const comments = raw.comments.map(comment => PostCommentMapper.toDomain(comment))
        const likes = raw.likes.map(like => PostLikesMapper.toDomain(like))
        const medias = raw.medias.map(media => PostMediaMapper.toDomain(media))

        post.id = raw.id
        post.author_id = raw.user.id
        post.author_name = raw.user.name
        post.title = raw.title
        post.caption = raw.caption
        post.comments = comments.length > 0 ? comments  : []
        post.likes = likes.length > 0 ? likes : []
        post.medias = medias.length > 0 ? medias : []
        return post
    }
}