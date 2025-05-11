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
import { UserEntity } from '../user/persistance/user.entity'
import { ReservationTransaction } from './domain/reservation-transaction'

export type ServerToClientTransactionEvents = {
	'track-reservation': (order: ReservationTransaction) => void
	'new-reservation': (order: ReservationTransaction) => void
	'reservation-changes': (order: ReservationTransaction) => void
}

@Injectable()
@WebSocketGateway({ namespace: '/reservation' })
export class ReservationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
		client.emit('welcome', 'Welcome to the transaction gateway')
		this.server.socketsLeave(`${client.user.id}`)
		client.join(`${client.user.id}`)
	}

	trackReservation(user: UserEntity, reservation: ReservationTransaction) {
		this.server.in(`${user.id}`).socketsJoin(`track-reservation-${reservation.transactionId}`)
		this.notifyTrackReservation(reservation)
	}

	notifyNewReservation(reservation: ReservationTransaction) {
		this.server.to(`${reservation.restaurant.id}`).emit('new-reservation', reservation)
	}

	notifyReservationChanges(reservation: ReservationTransaction) {
		this.server.to(`${reservation.restaurant.id}`).emit('reservation-changes', reservation)
	}

	notifyTrackReservation(reservation: ReservationTransaction) {
		this.server
			.to(`track-reservation-${reservation.transactionId}`)
			.emit('track-reservation', reservation)
	}

	handleDisconnect(client: GuardedSocketDto) {
		client.leave(`${client.user.id}`)
	}
}
