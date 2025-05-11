import { Server, Socket } from 'socket.io'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EntityManager } from '@mikro-orm/postgresql'
import { GatewayAuthMiddleware, GuardedSocketDto } from '../../middleware/gateway.middleware'
import { UserEntity } from '../user/persistance/user.entity'
import { TopupNotificationResponseDto } from './dto/topup-notification-response.dart.dto'

export type serverToClientTopupNotification = {
	'topup-notification': (message: TopupNotificationResponseDto) => void
}

@Injectable()
@WebSocketGateway({ namespace: '/topup' })
export class TopupGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly jwtService: JwtService,
		private readonly entityManager: EntityManager
	) {}

	@WebSocketServer()
	server: Server<any, serverToClientTopupNotification>

	afterInit(currentServer: Server) {
		currentServer.use(GatewayAuthMiddleware(this.jwtService, this.entityManager))
	}

	handleConnection(client: GuardedSocketDto) {
		console.log(`client: ${client.user.id}`)
		client.emit('welcome', 'Welcome to the transaction gateway')
		this.server.socketsLeave(`${client.user.id}`)
		client.join(`${client.user.id}`)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}

	trackTopupNotification(user: UserEntity, topupId: string) {
		this.server.in(`${user.id}`).socketsJoin(`track-topup-notification-${topupId}`)
	}

	notifyTopupNotification(topupId: string, message: TopupNotificationResponseDto) {
		console.log('join')
		this.server.to(`track-topup-notification-${topupId}`).emit('topup-notification', message)
	}
}
