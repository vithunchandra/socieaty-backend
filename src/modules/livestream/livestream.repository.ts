import { Injectable } from '@nestjs/common'
import {
	AccessToken,
	DataPacket_Kind,
	RoomServiceClient,
	WebhookReceiver
} from 'livekit-server-sdk'
import { CreateAccessTokenDto } from './persistence/dto/create-access-token.dto'
import { CreateRoomDto } from './persistence/dto/create-room.dto'
import { LiveRoomMetadata } from './domain/live-room-metadata'
import { LivestreamRoomComment } from './domain/livestream-room-comment'
import { LivestreamDataType } from './domain/livestream-data'
import { LivestreamRoomLike } from './domain/livestream-room-like'

@Injectable()
export class LivestreamRepository {
	private readonly roomService: RoomServiceClient
	constructor() {
		console.log(process.env.LIVEKIT_HOST)
		console.log(process.env.LIVEKIT_API_KEY)
		console.log(process.env.LIVEKIT_API_SECRET)
		this.roomService = new RoomServiceClient(
			process.env.LIVEKIT_HOST!,
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!
		)
	}

	async createRoom(data: CreateRoomDto) {
		const metadata = new LiveRoomMetadata()
		metadata.ownerId = data.ownerId
		metadata.roomTitle = data.roomTitle
		const room = await this.roomService.createRoom({
			name: data.roomName,
			metadata: JSON.stringify(metadata)
		})
		return room
	}

	async getAllRoom() {
		const rooms = await this.roomService.listRooms()
		console.log(rooms)
		return rooms
	}

	async getRoomByName(roomName: string) {
		const rooms = await this.roomService.listRooms()
		for (const room of rooms) {
			if (room.name === roomName) {
				return room
			}
		}
		return null
	}

	async deleteRoom(roomName: string): Promise<boolean> {
		await this.roomService.deleteRoom(roomName)
		const rooms = await this.roomService.listRooms()
		let isDeleted = true
		for (const room of rooms) {
			if (room.name === roomName) {
				isDeleted = false
				break
			}
		}
		return isDeleted
	}

	async createAccessToken(data: CreateAccessTokenDto) {
		const accessToken = new AccessToken(
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!,
			{
				identity: data.user.id,
				name: data.user.name,
				attributes: {
					id: data.user.id,
					isStreamer: 'true'
				},
				ttl: 1800
			}
		)
		accessToken.addGrant({
			canPublish: data.canPublish,
			canSubscribe: data.canSubscribe,
			canPublishData: data.canPublishData,
			roomAdmin: data.roomAdmin,
			roomJoin: true,
			room: data.roomName
		})
		return accessToken.toJwt()
	}

	async createToken(identity: string) {
		console.log(identity)
		const accessToken = new AccessToken(
			process.env.LIVEKIT_API_KEY!,
			process.env.LIVEKIT_API_SECRET!,
			{
				identity: identity,
				ttl: 1800
			}
		)

		accessToken.addGrant({
			roomJoin: true,
			room: 'test'
		})

		return await accessToken.toJwt()
	}

	async sendComment(comment: LivestreamRoomComment) {
		const encoder = new TextEncoder()
		const stringCommentData = JSON.stringify(comment)
		const uint8CommentData = encoder.encode(stringCommentData)
		console.log(comment)
		await this.roomService.sendData(
			comment.roomName,
			uint8CommentData,
			DataPacket_Kind.LOSSY,
			{ topic: LivestreamDataType.COMMENT }
		)
	}

	sendLike(likes: LivestreamRoomLike) {
		const encoder = new TextEncoder()
		const stringLikeData = JSON.stringify(likes)
		const uint8LikesData = encoder.encode(stringLikeData)
		this.roomService.sendData(
			likes.roomName,
			uint8LikesData,
			DataPacket_Kind.RELIABLE,
			{ topic: LivestreamDataType.LIKE }
		)
	}
}
