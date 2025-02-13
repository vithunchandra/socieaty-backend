import { PostMedia } from "../../post-media/domain/post-media"
import { Point } from "../../restaurant/persistence/custom-type/PointType"

export class Post{
    id: string
    authorId: string
    authorName: string
    title: string
    caption: string
    location?: Point | null
    medias: PostMedia[]
}