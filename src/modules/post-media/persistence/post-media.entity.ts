import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { PostEntity } from '../../post/persistence/post.entity'

@Entity({ tableName: 'post-media' })
export class PostMediaEntity extends BaseEntity {
	@Property({ nullable: false })
	url: string

	@Property({ nullable: false })
	type: string

	@Property({ nullable: false })
	extension: string

	@Property({ nullable: true })
	videoThumbnailUrl?: string

	@ManyToOne({
		entity: () => PostEntity,
		fieldName: 'post_id',
		inversedBy: 'medias',
		index: true
	})
	post: PostEntity

	constructor(
		post: PostEntity,
		url: string,
		type: string,
		extension: string,
		videoThumbnailUrl: string
	) {
		super()
		this.post = post
		this.url = url
		this.type = type
		this.extension = extension
		this.videoThumbnailUrl = videoThumbnailUrl
	}
}
