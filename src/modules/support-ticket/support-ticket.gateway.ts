import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Server } from 'socket.io'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { GatewayAuthMiddleware, GuardedSocketDto } from '../../middleware/gateway.middleware'
import { SupportTicket } from './domain/support-ticket'
import { UserEntity } from '../user/persistance/User.entity'

export type ServerToClientSupportTicketEvents = {
	'track-support-ticket': (order: SupportTicket) => void
	'new-support-ticket': (order: SupportTicket) => void
	'support-ticket-changes': (order: SupportTicket) => void
}

@Injectable()
@WebSocketGateway({ namespace: '/support-ticket' })
export class SupportTicketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly jwtService: JwtService,
		private readonly entityManager: EntityManager
	) {}
	@WebSocketServer()
	server: Server<any, ServerToClientSupportTicketEvents>

	afterInit(currentServer: Server) {
		currentServer.use(GatewayAuthMiddleware(this.jwtService, this.entityManager))
	}

	handleConnection(client: GuardedSocketDto) {
		client.emit('welcome', 'Welcome to the support ticket gateway')
		this.server.socketsLeave(`${client.user.id}`)
		client.join(`${client.user.id}`)
	}

	trackSupportTicket(user: UserEntity, supportTicket: SupportTicket) {
		this.server.in(`${user.id}`).socketsJoin(`track-support-ticket-${supportTicket.id}`)
		this.notifyTrackSupportTicket(supportTicket)
	}

	notifyNewSupportTicket(supportTicket: SupportTicket, admin: UserEntity) {
		this.server.to(`${supportTicket.user.id}`).emit('new-support-ticket', supportTicket)
		this.server.to(`${admin.id}`).emit('new-support-ticket', supportTicket)
	}

	notifySupportTicketChanges(supportTicket: SupportTicket, admin: UserEntity) {
		this.server.to(`${supportTicket.user.id}`).emit('support-ticket-changes', supportTicket)
		this.server.to(`${admin.id}`).emit('support-ticket-changes', supportTicket)
	}

	notifyTrackSupportTicket(supportTicket: SupportTicket) {
		this.server
			.to(`track-support-ticket-${supportTicket.id}`)
			.emit('track-support-ticket', supportTicket)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}
}
