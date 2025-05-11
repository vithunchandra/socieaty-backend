import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { UserEntity } from '../../user/persistance/user.entity'
import { BaseEntity } from '../../../database/model/base/Base.entity'

@Entity({ tableName: 'livestream-room-comment' })
export class LivestreamRoomCommentEntity extends BaseEntity {
	@Property()
	roomName: string

	@ManyToOne({
		entity: () => UserEntity,
		fieldName: 'user_id'
	})
	user: UserEntity

	@Property()
	text: string

	constructor(user: UserEntity, roomName: string, text: string) {
		super()
		this.user = user
		this.roomName = roomName
		this.text = text
	}
}
