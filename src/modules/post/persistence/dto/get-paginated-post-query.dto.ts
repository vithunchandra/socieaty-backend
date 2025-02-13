import { Cursor } from '@mikro-orm/core'
import { PostEntity } from '../post.entity'

export class GetPaginatedPostQueryDto {
    offset: number
    limit: number
    authorId?: string
}
