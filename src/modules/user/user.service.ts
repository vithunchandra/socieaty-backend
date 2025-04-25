import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { UserDaoService } from './persistance/User.dao.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { PaginateUsersRequestQueryDto } from './dto/paginate-users-request-query.dto'
import { UserEntity, UserRole } from './persistance/User.entity'
import { UserMapper } from './domain/user.mapper'

@Injectable()
export class UserService {
	constructor(
		private readonly userDaoService: UserDaoService,
		private readonly em: EntityManager
	) {}

	async paginateUsers(query: PaginateUsersRequestQueryDto, user: UserEntity) {
		const users = await this.userDaoService.paginateUsers({
			...query,
			includeDeleted: user.role === UserRole.ADMIN
		})
		return {
			users: users.map((user) => UserMapper.toDomain(user))
		}
	}

	async deleteUser(id: string) {
		const user = await this.userDaoService.findOneById(id)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		user.deletedAt = new Date()
		await this.em.flush()
		return {
			message: 'User deleted successfully'
		}
	}

	async undeleteUser(id: string) {
		const user = await this.userDaoService.findDeletedUserById(id)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		user.deletedAt = undefined
		await this.em.flush()
		return {
			message: 'User undeleted successfully'
		}
	}
}
