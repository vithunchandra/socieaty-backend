import {
	Collection,
	Entity,
	Enum,
	ManyToMany,
	OneToMany,
	OneToOne,
	Property
} from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { RestaurantEntity } from '../../restaurant/persistence/Restaurant.entity'
import { CustomerEntity } from '../../customer/persistence/Customer.entity'
import { PostEntity } from '../../post/persistence/post.entity'
import { PostCommentEntity } from '../../post-comment/persistence/post-comment.entity'

@Entity({ tableName: 'user' })
export class UserEntity extends BaseEntity {
	@Property({ nullable: false, type: 'varchar(128)' })
	name!: string

	@Property({ nullable: false, unique: true, type: 'varchar(128)' })
	email!: string

	@Property({ nullable: false, type: 'varchar(128)' })
	password!: string

	@Property({ nullable: false })
	phoneNumber: string

	@Property({ nullable: true })
	profilePictureUrl?: string | null

	@Enum(() => UserRole)
	role: UserRole

	@OneToOne({
		entity: () => RestaurantEntity,
		mappedBy: (restaurant) => restaurant.userData,
		nullable: true,
		index: true
	})
	restaurantData: RestaurantEntity | null = null

	@OneToOne({
		entity: () => CustomerEntity,
		mappedBy: (customer) => customer.userData,
		nullable: true,
		index: true
	})
	customerData: CustomerEntity | null = null

	@OneToMany({
		entity: () => PostEntity,
		mappedBy: 'user',
		orphanRemoval: true,
		index: true
	})
	posts = new Collection<PostEntity>(this)

	@OneToMany({
		entity: () => PostCommentEntity,
		mappedBy: 'user',
		orphanRemoval: true,
		index: true
	})
	comments = new Collection<PostCommentEntity>(this)

	@ManyToMany({
		entity: () => PostEntity,
		inversedBy: 'postLikes',
		index: true
	})
	likedPosts = new Collection<PostEntity>(this)

	@ManyToMany({
		entity: () => PostCommentEntity,
		inversedBy: 'commentLikes',
		index: true
	})
	likedComments = new Collection<PostCommentEntity>(this)

	// @OneToMany({
	//    entity: () => LivestreamRoomCommentEntity,
	//    mappedBy: 'user',
	//    orphanRemoval: true,
	// })
	// livestreamRoomComments: Collection<LivestreamRoomCommentEntity>

	constructor(
		name: string,
		email: string,
		password: string,
		phoneNumber: string,
		role: UserRole,
		profilePictureUrl?: string
	) {
		super()
		this.name = name
		this.email = email
		this.password = password
		this.phoneNumber = phoneNumber
		this.profilePictureUrl = profilePictureUrl
		this.role = role
	}
}

export enum UserRole {
	ADMIN = 'Admin',
	CUSTOMER = 'Customer',
	RESTAURANT = 'Restaurant'
}
