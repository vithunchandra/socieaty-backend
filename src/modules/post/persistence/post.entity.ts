import {
	Cascade,
	Collection,
	Entity,
	Index,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OptionalProps,
	Property
} from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import {
	Point,
	PointType
} from '../../restaurant/persistence/custom-type/PointType'
import { PostCommentEntity } from '../../post-comment/persistence/post-comment.entity'
import { UserEntity } from '../../user/persistance/User.entity'
import { PostMediaEntity } from '../../post-media/persistence/post-media.entity'
import { PostHashtagEntity } from '../../post-hashtag/persistence/post-hashtag.entity'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity<'location'> {
	@Property({ nullable: true, default: '' })
	title: string

	@Property({ nullable: false })
	caption: string

	@Property({ type: PointType, nullable: true })
	location?: Point | null

	@OneToMany({
		entity: () => PostMediaEntity,
		mappedBy: 'post',
		index: true,
		cascade: [Cascade.PERSIST, Cascade.REMOVE],
		orphanRemoval: true
	})
	medias = new Collection<PostMediaEntity>(this)

	@OneToMany({
		entity: () => PostCommentEntity,
		mappedBy: 'post',
		index: true,
		cascade: [Cascade.PERSIST, Cascade.REMOVE],
		orphanRemoval: true
	})
	comments = new Collection<PostCommentEntity>(this)

	@ManyToMany({
		entity: () => UserEntity,
		mappedBy: 'likedPosts',
		index: true
	})
	postLikes = new Collection<UserEntity>(this)

	@Index()
	@ManyToOne({
		entity: () => UserEntity,
		inversedBy: 'posts',
		fieldName: 'user_id',
		index: true
	})
	user: UserEntity

	@ManyToMany({
		entity: () => PostHashtagEntity,
		mappedBy: 'post',
		index: true
	})
	hashtags = new Collection<PostHashtagEntity>(this)

	constructor(
		user: UserEntity,
		title: string,
		caption: string,
		location?: Point
	) {
		super()
		this.user = user
		this.title = title
		this.caption = caption
		this.location = location
	}
}
