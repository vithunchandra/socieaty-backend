import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
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
import { UserEntity } from '../user/persistance/User.entity'
import { TransactionMessage } from './domain/transaction-message'

export type serverToClientTransactionMessageEvents = {
	'new-transaction-message': (message: TransactionMessage) => void
}

@Injectable()
@WebSocketGateway({ namespace: 'food-order/message' })
export class TransactionMessageGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly jwtService: JwtService,
		private readonly entityManager: EntityManager
	) {}

	@WebSocketServer()
	server: Server<any, serverToClientTransactionMessageEvents>

	afterInit(currentServer: Server) {
		currentServer.use(GatewayAuthMiddleware(this.jwtService, this.entityManager))
	}

	async trackTransactionMessage(user: UserEntity, transactionId: string) {
		const sockets = await this.server.in(`${user.id}`).fetchSockets()
		console.log(`sockets: ${sockets}`)
		this.server.in(`${user.id}`).socketsJoin(`track-transaction-message-${transactionId}`)
	}

	async notifyNewTransactionMessage(transactionId: string, message: TransactionMessage) {
		const sockets = await this.server.in(`track-transaction-message-${transactionId}`).fetchSockets()
		console.log(`sockets: ${sockets}`)
		this.server
			.to(`track-transaction-message-${transactionId}`)
			.emit('new-transaction-message', message)
        
	}

	handleConnection(client: GuardedSocketDto) {
		client.emit('welcome', 'Welcome to the transaction gateway')
		client.join(`${client.user.id}`)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}
}
