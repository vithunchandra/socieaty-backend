import { PostCommentMapper } from "../../post-comment/domain/post-comment.mapper"
import { PostHashtagMapper } from "../../post-hashtag/domain/post-hashtag.mapper"
import { PostMediaMapper } from "../../post-media/domain/post-media.mapper"
import { PostEntity } from "../persistence/post.entity"
import { Post } from "./post"
import { UserMapper } from "../../user/domain/user.mapper"
import { User } from "../../user/domain/User"
import { PostLike } from "./post-likes"

export class PostMapper{
    static toDomain(raw: PostEntity | null): Post | null{
        if(!raw) return null

        const post = new Post()

        const comments = raw.comments.map(comment => PostCommentMapper.toDomain(comment))
        const likes = raw.postLikes.map(like => UserMapper.toDomain(like))
        const medias = raw.medias.map(media => PostMediaMapper.toDomain(media))
        const hashtags = raw.hashtags.map(hashtag => PostHashtagMapper.toDomain(hashtag))

        post.id = raw.id
        post.authorId = raw.user.id
        post.authorName = raw.user.name
        post.title = raw.title
        post.caption = raw.caption
        post.comments = comments.length
        post.likes = likes.length
        post.medias = medias.length > 0 ? medias : []
        post.hashtags = hashtags.length > 0 ? hashtags : []
        return post
    }

    static ToPostLikesDomain(raw: PostEntity | null): PostLike[]{
        if(!raw) return []
        const postLikes = raw.postLikes.map(like => {
            const postLike = new PostLike()
            postLike.postId = raw.id
            postLike.userId = like.id
            postLike.userName = like.name
            return postLike
        })
        
        return postLikes
    }
}