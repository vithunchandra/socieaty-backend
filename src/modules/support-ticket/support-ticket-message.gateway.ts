import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { GatewayAuthMiddleware, GuardedSocketDto } from '../../middleware/gateway.middleware'
import { JwtService } from '@nestjs/jwt'
import { EntityManager } from '@mikro-orm/postgresql'
import { UserEntity } from '../user/persistance/user.entity'
import { SupportTicketMessage } from './domain/support-ticket-message'

export type serverToClientSupportTicketMessageEvents = {
	'new-support-ticket-message': (message: SupportTicketMessage) => void
}

@Injectable()
@WebSocketGateway({ namespace: '/support-ticket/message' })
export class SupportTicketMessageGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly jwtService: JwtService,
		private readonly entityManager: EntityManager
	) {}

	@WebSocketServer()
	server: Server<any, serverToClientSupportTicketMessageEvents>

	afterInit(currentServer: Server) {
		currentServer.use(GatewayAuthMiddleware(this.jwtService, this.entityManager))
	}

	handleConnection(client: GuardedSocketDto) {
		console.log(`client: ${client.user.id}`)
		client.emit('welcome', 'Welcome to the support ticket message gateway')
		this.server.socketsLeave(`${client.user.id}`)
		client.join(`${client.user.id}`)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}

	trackSupportTicketMessage(user: UserEntity, supportTicketId: string) {
		this.server.in(`${user.id}`).socketsJoin(`track-support-ticket-message-${supportTicketId}`)
	}

	notifyNewSupportTicketMessage(supportTicketId: string, message: SupportTicketMessage) {
		this.server
			.to(`track-support-ticket-message-${supportTicketId}`)
			.emit('new-support-ticket-message', message)
	}
}
