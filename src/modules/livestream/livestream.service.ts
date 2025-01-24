import { Injectable, NotFoundException } from '@nestjs/common'
import { UserEntity } from '../user/persistance/User.entity'
import { LivestreamRepository } from './livestream.repository'
import { LiveRoomMapper } from './domain/live-room.mapper'
import { LivestreamDaoService } from './persistence/livestream.dao.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { WebhookEvent } from 'livekit-server-sdk'

@Injectable()
export class LiveStreamService {
	constructor(
		private readonly livestreamRepository: LivestreamRepository,
		private readonly livestreamDaoService: LivestreamDaoService,
		private readonly entityManager: EntityManager
	) {}

	async startLivestream(user: UserEntity, roomTitle: string) {
		const roomName = `${user.id}-room`
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
			roomAdmin: true
		})
		return {
			accessToken: accessToken
		}
	}

	async joinLivestream(user: UserEntity, roomName: string) {
		const accessToken = await this.livestreamRepository.createAccessToken({
			roomName,
			user,
			canPublish: false,
			canSubscribe: true,
			canPublishData: true,
			roomAdmin: false
		})
		return {
			accessToken: accessToken
		}
	}

	async getAllLivestreams() {
		const rooms = await this.livestreamRepository.getAllRoom()
		const mapped = rooms.map((room) => LiveRoomMapper.toDomain(room))
		console.log(mapped)
		return {
			rooms: mapped
		}
	}

	async createAuthToken(identity: string) {
		return this.livestreamRepository.createToken(identity)
	}

	async sendComment(user: UserEntity, roomName: string, text: string) {
		const room = await this.livestreamRepository.getRoomByName(roomName)
		if(!room){
			throw new NotFoundException("Livestream room not found")
		}
		const domainComment = this.livestreamDaoService.createComment({
			roomName: room.name,
			text,
			user
		})
		this.livestreamRepository.sendComment(domainComment)
		await this.entityManager.flush()
		return {
			comment: domainComment
		}
	}

	async sendLike(user: UserEntity, roomName: string, isLiked: boolean){
		const room = await this.livestreamRepository.getRoomByName(roomName)
		if(!room){
			throw new NotFoundException("Livestream room not found")
		}
		const isAlreadyLiked = await this.livestreamDaoService.isLiked(user, roomName)
		let result = isLiked
		if(isAlreadyLiked){
			result = await this.livestreamDaoService.likeLivestream({
				user,
				roomName
			})
		}
		await this.entityManager.flush()
		const likes = await this.livestreamDaoService.getAllLikes()
		this.livestreamRepository.sendLike({
			roomName,
			likes: likes.length
		})
		return {
			isLiked: result,
			likes: likes.length
		}
	}

	async handleWebhook(webhookEvent: WebhookEvent){
		let {room, event} = webhookEvent
		if(event = "room_finished"){
			if(room){
				this.livestreamDaoService.deleteAllCommentByRoomName(room.name)
				this.livestreamDaoService.deleteAllLikesByRoomName(room.name)
			}
		}
	}
}
