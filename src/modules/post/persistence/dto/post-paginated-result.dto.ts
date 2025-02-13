import { PostEntity } from "../post.entity"

export class PostPaginatedResultDto{
    items: PostEntity[]
    count: number
}