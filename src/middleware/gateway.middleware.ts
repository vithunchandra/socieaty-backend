import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { EntityManager } from '@mikro-orm/postgresql'
import { UserEntity } from '../modules/user/persistance/user.entity'

type GatewayIOMiddleware = (socket: Socket, next: (err?: Error) => void) => void

export class GuardedSocketDto extends Socket {
	user: UserEntity
}

export const GatewayAuthMiddleware = (
	jwtService: JwtService,
	em: EntityManager
): GatewayIOMiddleware => {
	return async (client: Socket, next: (err?: Error) => void) => {
		try {
			const token = client.handshake.headers.authorization?.split('Bearer ')[1]

			if (!token) {
				next(new UnauthorizedException('Token is required'))
				return
			}
			try {
				const payload = await jwtService.verifyAsync(token, {
					secret: process.env.AUTH_SECRET_KEY
				})

				// Create a new EntityManager context
				const fork = em.fork()

				// Use the forked EntityManager
				const user = await fork.findOne(UserEntity, { id: payload.id })
				if (!user) {
					next(new NotFoundException('User not found'))
					return
				}
				client['user'] = user
				next()
			} catch (error) {
				next(new UnauthorizedException('Invalid token'))
			}
		} catch (error) {
			next(error)
		}
	}
}
