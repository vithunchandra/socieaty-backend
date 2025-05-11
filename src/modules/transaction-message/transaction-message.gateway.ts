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
import { UserEntity } from '../user/persistance/user.entity'
import { TransactionMessage } from './domain/transaction-message'

export type serverToClientTransactionMessageEvents = {
	'new-transaction-message': (message: TransactionMessage) => void
}

@Injectable()
@WebSocketGateway({ namespace: '/transaction/message' })
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

	handleConnection(client: GuardedSocketDto) {
		console.log(`client: ${client.user.id}`)
		client.emit('welcome', 'Welcome to the transaction gateway')
		this.server.socketsLeave(`${client.user.id}`)
		client.join(`${client.user.id}`)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}

	trackTransactionMessage(user: UserEntity, transactionId: string) {
		this.server.in(`${user.id}`).socketsJoin(`track-transaction-message-${transactionId}`)
	}

	notifyNewTransactionMessage(transactionId: string, message: TransactionMessage) {
		this.server
			.to(`track-transaction-message-${transactionId}`)
			.emit('new-transaction-message', message)
	}
}
