import { PostComment } from "../../post-comment/domain/post-comment"
import { PostHashtag } from "../../post-hashtag/domain/post-hashtag"
import { PostMedia } from "../../post-media/domain/post-media"
import { Point } from "../../restaurant/persistence/custom-type/PointType"
import { UserEntity } from "../../user/persistance/User.entity"

export class Post{
    id: string
    authorId: string
    authorName: string
    title: string
    caption: string
    location?: Point
    medias: PostMedia[]
    comments: number
    likes: number
    hashtags: PostHashtag[]
}