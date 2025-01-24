import { UserMapper } from '../../user/domain/user.mapper'
import { LivestreamRoomCommentEntity } from '../persistence/livestream-room-comment.entity'
import { LivestreamRoomComment } from './livestream-room-comment'

export class LivestreamRoomCommentMapper {
	static toDomain(raw: LivestreamRoomCommentEntity) {
		const livestreaRoomComment = new LivestreamRoomComment()
		livestreaRoomComment.roomName = raw.roomName
		livestreaRoomComment.user = UserMapper.toDomain(raw.user)
		livestreaRoomComment.text = raw.text

		return livestreaRoomComment
	}
}
