import {
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
	SubscribeMessage
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GatewayAuthMiddleware, GuardedSocketDto } from '../../middleware/gateway.middleware'
import { EntityManager } from '@mikro-orm/postgresql'
import { FoodOrderTransaction } from './domain/food-order-transaction'
import { TransactionService } from '../transaction/transaction.service'
import { UserEntity } from '../user/persistance/User.entity'

export type ServerToClientTransactionEvents = {
	'track-order': (order: FoodOrderTransaction) => void
	'new-order': (order: FoodOrderTransaction) => void
	'order-changes': (order: FoodOrderTransaction) => void
}

@Injectable()
@WebSocketGateway({namespace: '/food-order'})
export class FoodOrderTransactionGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly jwtService: JwtService,
		private readonly entityManager: EntityManager
	) {}
	@WebSocketServer()
	server: Server<any, ServerToClientTransactionEvents>

	afterInit(currentServer: Server) {
		currentServer.use(GatewayAuthMiddleware(this.jwtService, this.entityManager))
	}

	handleConnection(client: GuardedSocketDto) {
		console.log(`handleConnection: ${client.user.id}`)
		client.emit('welcome', 'Welcome to the transaction gateway')
		this.server.socketsLeave(`${client.user.id}`)
		client.join(`${client.user.id}`)
	}

	trackOrder(user: UserEntity, transaction: FoodOrderTransaction) {
		this.server.in(`${user.id}`).socketsJoin(`track-order-${transaction.transactionId}`)
		this.notifyTrackOrder(transaction)
	}

	notifyNewOrder(order: FoodOrderTransaction) {
		this.server.to(`${order.restaurant.id}`).emit('new-order', order)
	}

	notifyTrackOrder(order: FoodOrderTransaction) {
		console.log(`notifyTrackOrder: ${order.transactionId}`)
		this.server.to(`track-order-${order.transactionId}`).emit('track-order', order)
	}

	notifyOrderChanges(order: FoodOrderTransaction) {
		this.server.to(`${order.restaurant.id}`).emit('order-changes', order)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}
}
