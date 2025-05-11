import { PostComment } from '../../post-comment/domain/post-comment'
import { PostHashtag } from '../../post-hashtag/domain/post-hashtag'
import { PostMedia } from '../../post-media/domain/post-media'
import { Point } from '../../restaurant/persistence/custom-type/point-type'
import { User } from '../../user/domain/user'
import { UserEntity } from '../../user/persistance/user.entity'

export class Post {
	id: string
	authorId: string
	authorName: string
	title: string
	caption: string
	location?: Point | null
	medias: PostMedia[]
	comments?: number
	likes?: User[]
	hashtags?: PostHashtag[]
}
