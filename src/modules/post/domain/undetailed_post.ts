import { PostMedia } from '../../post-media/domain/post-media'
import { Point } from '../../restaurant/persistence/custom-type/point-type'

export class Post {
	id: string
	authorId: string
	authorName: string
	title: string
	caption: string
	location?: Point | null
	medias: PostMedia[]
}
