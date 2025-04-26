import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { UserDaoService } from './persistance/User.dao.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { PaginateUsersRequestQueryDto } from './dto/paginate-users-request-query.dto'
import { UserEntity, UserRole } from './persistance/User.entity'
import { UserMapper } from './domain/user.mapper'
import { PaginationDto } from '../../dto/pagination.dto'

@Injectable()
export class UserService {
	constructor(
		private readonly userDaoService: UserDaoService,
		private readonly em: EntityManager
	) {}

	async getUserData(user_id: string, currentUser: UserEntity) {
		const userData = await this.userDaoService.findOneById(
			user_id,
			currentUser.role !== UserRole.ADMIN
		)
		if (!userData) {
			throw new NotFoundException('User not found')
		}

		return UserMapper.toDomain(userData)
	}

	async paginateUsers(query: PaginateUsersRequestQueryDto, user: UserEntity) {
		console.log(query)
		const { items, count } = await this.userDaoService.paginateUsers({
			...query,
			includeDeleted: user.role === UserRole.ADMIN
		})
		const pagination = PaginationDto.createPaginationDto(
			count,
			query.paginationQuery.pageSize,
			query.paginationQuery.page
		)
		console.log(pagination)
		return {
			users: items.map((user) => UserMapper.toDomain(user)),
			pagination
		}
	}

	async deleteUser(id: string) {
		let userData = await this.userDaoService.findOneById(id, false)
		if (!userData) {
			throw new NotFoundException('User not found')
		}

		userData.deletedAt = new Date()
		await this.em.flush()
		userData = await this.userDaoService.findOneById(id, false)
		console.log(userData)
		return UserMapper.toDomain(userData!)
	}

	async undeleteUser(id: string) {
		let user = await this.userDaoService.findOneById(id, false)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		user.deletedAt = undefined
		await this.em.flush()
		user = await this.userDaoService.findOneById(id, false)
		console.log(user)
		return UserMapper.toDomain(user!)
	}
}
