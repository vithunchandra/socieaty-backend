import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/base.entity'
import { UserEntity } from '../../user/persistance/user.entity'

@Entity({ tableName: 'livestream-room-like' })
export class LivestreamRoomLikeEntity extends BaseEntity {
	@Property()
	roomName: string

	@ManyToOne({
		entity: () => UserEntity,
		fieldName: 'user_id'
	})
	user: UserEntity

	constructor(user: UserEntity, roomName: string) {
		super()
		this.user = user
		this.roomName = roomName
	}
}
