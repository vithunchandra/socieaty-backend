import {
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
	SubscribeMessage
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GatewayAuthMiddleware, GuardedSocketDto } from '../../middleware/gateway.middleware'
import { EntityManager } from '@mikro-orm/postgresql'
import { FoodOrderTransaction } from './domain/food-order-transaction'

export type ServerToClientEvents = {
	'track-order': (order: FoodOrderTransaction) => void
	'new-order': (order: FoodOrderTransaction) => void
}

@Injectable()
@WebSocketGateway({ namespace: 'food-order' })
export class TransactionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly jwtService: JwtService,
		private readonly entityManager: EntityManager
	) {}
	@WebSocketServer()
	server: Server<any, ServerToClientEvents>

	afterInit(currentServer: Server) {
		currentServer.use(GatewayAuthMiddleware(this.jwtService, this.entityManager))
	}

	handleConnection(client: GuardedSocketDto) {
		client.join(`${client.user.id}`)
		client.emit('welcome', 'Welcome to the transaction gateway')
	}

	@SubscribeMessage('track-order')
	trackOrder(client: GuardedSocketDto, data: { orderId: string }) {
		client.join(`track-order-${data.orderId}`)
	}

	notifyNewOrder(order: FoodOrderTransaction) {
		console.log('notifyNewOrder', order)
		this.server.to(`${order.restaurant.id}`).emit('new-order', order)
	}

	notifyTrackOrder(order: FoodOrderTransaction) {
		this.server.to(`track-order-${order.id}`).emit('track-order', order)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}
}
