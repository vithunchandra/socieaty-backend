import { PostComment } from "../../post-comment/domain/post-comment"
import { PostLikes } from "../../post-likes/domain/post-likes"
import { PostMedia } from "../../post-media/domain/post-media"
import { Point } from "../../restaurant/persistence/custom-type/PointType"

export class Post{
    id: string
    author_id: string
    author_name: string
    title: string
    caption: string
    location?: Point
    medias: PostMedia[]
    comments: PostComment[]
    likes: PostLikes[]
}