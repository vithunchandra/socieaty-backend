import { Injectable } from '@nestjs/common'
import {
	AccessToken,
	DataPacket_Kind,
	RoomServiceClient
} from 'livekit-server-sdk'
import { LivestreamRoomCommentEntity } from './livestream-room-comment.entity'
import { LivestreamRoomLikeEntity } from './livestream-room-like.entity'
import { EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { SendCommentDto } from './dto/send-livestream-comment..dto'
import { LivestreamRoomCommentMapper } from '../domain/livestream-room-comment.mapper'
import { LikeLivestreamDto } from './dto/like-livestream.dto'
import { UserEntity } from '../../user/persistance/User.entity'
import { LivestreamRoomLike } from '../domain/livestream-room-like'

@Injectable()
export class LivestreamDaoService {
	private readonly roomService: RoomServiceClient
	constructor(
		@InjectRepository(LivestreamRoomCommentEntity)
		private readonly livestreamRoomCommentRepository: EntityRepository<LivestreamRoomCommentEntity>,
		@InjectRepository(LivestreamRoomLikeEntity)
		private readonly livestreamRoomLikeRepository: EntityRepository<LivestreamRoomLikeEntity>
	) {}

	createComment(data: SendCommentDto) {
		const comment = this.livestreamRoomCommentRepository.create({
			user: data.user,
			roomName: data.roomName,
			text: data.text
		})
		const domainComment = LivestreamRoomCommentMapper.toDomain(comment)
		return domainComment
	}

	async getAllCommentByRoomName(roomName: string) {
		return await this.livestreamRoomCommentRepository.findAll({
			where: { roomName },
			populate: ['user.*']
		})
	}

	async deleteAllCommentByRoomName(roomName: string) {
		return await this.livestreamRoomCommentRepository.nativeDelete({
			roomName
		})
	}

	async likeLivestream(data: LikeLivestreamDto) {
		const { roomName, user } = data
		const isExist = await this.isLiked(user, roomName)
		let isLiked: boolean
		if (isExist) {
			await this.livestreamRoomLikeRepository.nativeDelete({
				roomName,
				user
			})
			isLiked = false
		} else {
			this.livestreamRoomLikeRepository.create({
				user,
				roomName
			})
			isLiked = true
		}
		return isLiked
	}

	async getAllLikesByRoomName(roomName: string) {
		return await this.livestreamRoomLikeRepository.findAll({
			where: {roomName}
		})
	}

	async isLiked(user: UserEntity, roomName: string) {
		const value = await this.livestreamRoomLikeRepository.findOne({
			user: user,
			roomName
		})
		return value ? true : false
	}

	async deleteAllLikesByRoomName(roomName: string) {
		return await this.livestreamRoomLikeRepository.nativeDelete({
			roomName
		})
	}
}
