import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UserEntity, UserRole } from '../user/persistance/user.entity'
import { LivestreamRepository } from './livestream.repository'
import { LiveRoomMapper } from './domain/live-room.mapper'
import { LivestreamDaoService } from './persistence/livestream.dao.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { WebhookEvent } from 'livekit-server-sdk'
import { UserDaoService } from '../user/persistance/user.dao.service'
import { LiveRoomMetadata } from './domain/live-room-metadata'
import { LivestreamRoomCommentMapper } from './domain/livestream-room-comment.mapper'
import { LiveRoomMetaDataMapper } from './domain/live-room-meta-data.mapper'
import { GetAllLivestreamsRequestQueryDto } from './dto/get-all-livestream-request-query.dto'

@Injectable()
export class LiveStreamService {
	constructor(
		private readonly livestreamRepository: LivestreamRepository,
		private readonly livestreamDaoService: LivestreamDaoService,
		private readonly UserDaoService: UserDaoService,
		private readonly entityManager: EntityManager
	) {}

	async startLivestream(user: UserEntity, roomTitle: string) {
		const roomName = `${user.id}-${new Date().getTime()}-room`
		const room = await this.livestreamRepository.createRoom({
			ownerId: user.id,
			roomName,
			roomTitle
		})
		const accessToken = await this.livestreamRepository.createAccessToken({
			roomName: room.name,
			user,
			canPublish: true,
			canSubscribe: true,
			canPublishData: true,
			roomAdmin: true,
			roomCreate: true
		})
		return {
			accessToken: accessToken
		}
	}

	async joinLivestream(user: UserEntity, roomName: string) {
		const rooms = await this.livestreamRepository.getRoomByName(roomName)
		if (!rooms) {
			throw new NotFoundException('Livestream not found')
		}
		const accessToken = await this.livestreamRepository.createAccessToken({
			roomName,
			user,
			canPublish: false,
			canSubscribe: true,
			canPublishData: true,
			roomAdmin: false,
			roomCreate: false
		})
		return {
			accessToken: accessToken
		}
	}

	// async getAllLivestreams(user: UserEntity) {
	// 	const rooms = await this.livestreamRepository.getAllRoom()
	// 	const mapped = await Promise.all(
	// 		rooms.map(async (room) => {
	// 			if (room.metadata != '') {
	// 				const metadata = JSON.parse(room.metadata) as LiveRoomMetadata
	// 				const owner = await this.UserDaoService.findOneById(metadata.ownerId, false)
	// 				const commentsCount = await this.livestreamDaoService.getAllCommentByRoomName(
	// 					room.name
	// 				)
	// 				const likesCount = await this.livestreamDaoService.getAllLikesByRoomName(
	// 					room.name
	// 				)
	// 				return LiveRoomMapper.toDomain(
	// 					room,
	// 					owner!,
	// 					commentsCount.length,
	// 					likesCount.length
	// 				)
	// 			}
	// 			return null
	// 		})
	// 	)
	// 	const filteredMapped = mapped.filter((room) => {
	// 		return room !== null && room.metadata.ownerId != user.id
	// 	})
	// 	return {
	// 		rooms: filteredMapped
	// 	}
	// }

	async getAllLivestreams(query: GetAllLivestreamsRequestQueryDto, user: UserEntity) {
		const { role, searchQuery } = query
		const rooms = await this.livestreamRepository.getAllRoom()
		const mapped = await Promise.all(
			rooms.map(async (room) => {
				if (room.metadata != '' && room.numParticipants > 0) {
					const metadata = JSON.parse(room.metadata) as LiveRoomMetadata
					const owner = await this.UserDaoService.findOneById(metadata.ownerId, false)
					const isSearchQueryMatch = searchQuery
						? (owner && owner?.name.includes(searchQuery)) ||
							metadata.roomTitle.includes(searchQuery)
						: true
					const isRoleMatch = role ? owner?.role == role : true

					if (isSearchQueryMatch && isRoleMatch) {
						const commentsCount =
							await this.livestreamDaoService.getAllCommentByRoomName(room.name)
						const likesCount = await this.livestreamDaoService.getAllLikesByRoomName(
							room.name
						)
						return LiveRoomMapper.toDomain(
							room,
							owner!,
							commentsCount.length,
							likesCount.length
						)
					}
				}
				return null
			})
		)
		const filteredMapped = mapped.filter((room) => {
			return room !== null && room.metadata.ownerId != user.id
		})
		return {
			rooms: filteredMapped
		}
	}

	async createAuthToken(identity: string) {
		return this.livestreamRepository.createToken(identity)
	}

	async sendComment(user: UserEntity, roomName: string, text: string) {
		console.log(roomName)
		const room = await this.livestreamRepository.getRoomByName(roomName)
		if (!room) {
			throw new NotFoundException('Livestream room not found')
		}
		const domainComment = this.livestreamDaoService.createComment({
			roomName: room.name,
			text,
			user
		})

		console.log('test')
		await this.livestreamRepository.sendComment(domainComment)
		await this.entityManager.flush()
		return {
			comment: domainComment
		}
	}

	async getLivestreamComments(roomName: string) {
		const comments = await this.livestreamDaoService.getAllCommentByRoomName(roomName)
		return {
			comments: comments.map((comment) => LivestreamRoomCommentMapper.toDomain(comment))
		}
	}

	async sendLike(user: UserEntity, roomName: string, isLiked: boolean) {
		console.log(isLiked)
		const room = await this.livestreamRepository.getRoomByName(roomName)
		if (!room) {
			throw new NotFoundException('Livestream room not found')
		}
		const isAlreadyLiked = await this.livestreamDaoService.isLiked(user, roomName)
		let result = isLiked
		if (isAlreadyLiked !== isLiked) {
			result = await this.livestreamDaoService.likeLivestream({
				user,
				roomName
			})
		}
		await this.entityManager.flush()
		const likes = await this.livestreamDaoService.getAllLikesByRoomName(roomName)
		await this.livestreamRepository.sendLike({
			roomName,
			likes: likes.length
		})
		return {
			isLiked: result,
			likes: likes.length
		}
	}

	async getLivestreamLikes(roomName: string) {
		const likes = await this.livestreamDaoService.getAllLikesByRoomName(roomName)
		return {
			likes: likes.length
		}
	}

	async deleteRoom(roomName: string, user: UserEntity) {
		const room = await this.livestreamRepository.getRoomByName(roomName)
		if (!room) {
			throw new NotFoundException('Livestream room not found')
		}
		const metadata = LiveRoomMetaDataMapper.toDomain(room.metadata)
		if (user.role !== UserRole.ADMIN && metadata.ownerId !== user.id) {
			throw new BadRequestException('You are not allowed to delete this livestream room')
		}
		const result = await this.livestreamRepository.deleteRoom(roomName)
		return {
			isDeleted: result
		}
	}

	async handleWebhook(webhookEvent: WebhookEvent) {
		let { room, participant, event } = webhookEvent
		if (event == 'room_finished') {
			if (room) {
				await this.livestreamDaoService.deleteAllCommentByRoomName(room.name)
				await this.livestreamDaoService.deleteAllLikesByRoomName(room.name)
			}
		} else if (event == 'participant_left') {
			const roomMetadata = JSON.parse(room!.metadata) as LiveRoomMetadata
			console.log(participant, roomMetadata)
			if (participant!.identity == roomMetadata.ownerId) {
				await this.livestreamRepository.deleteRoom(room!.name)
			}
		}
	}
}
