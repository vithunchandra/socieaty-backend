import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { UserEntity } from './User.entity'
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql'
import { UserCreateDto } from './dto/UserDao.dto'
import { UpdateUserDataDto } from './dto/update-user-data.dto'
import { PaginateUsersQueryDto } from './dto/paginate-users-query.dto'

@Injectable()
export class UserDaoService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: EntityRepository<UserEntity>
	) {}

	create(data: UserCreateDto): UserEntity {
		const user = this.userRepository.create({
			name: data.name,
			email: data.email,
			password: data.password,
			phoneNumber: data.phoneNumber,
			profilePictureUrl: data.profilePictureUrl,
			role: data.role
		})
		return user
	}

	update(user: UserEntity, data: UpdateUserDataDto): UserEntity {
		user.name = data.name
		user.phoneNumber = data.phoneNumber
		user.profilePictureUrl = data.profilePictureUrl
		return user
	}

	async paginateUsers(query: PaginateUsersQueryDto): Promise<UserEntity[]> {
		const { page, pageSize } = query.paginationQuery
		const { name, email, role, includeDeleted} = query
		const filterQuery: FilterQuery<UserEntity> = {}
		let isFilterActive = true
		if (name) {
			filterQuery.name = { $ilike: `%${name}%` }
		}
		if (email) {
			filterQuery.email = { $ilike: `%${email}%` }
		}
		if (role) {
			filterQuery.role = role
		}
		if (includeDeleted) {
			isFilterActive = false
		}
		const users = await this.userRepository.findAll({
			where: filterQuery,
			offset: page * pageSize,
			limit: pageSize,
			filters: isFilterActive
		})
		return users
	}

	async paginateUsersForAdmin(query: PaginateUsersQueryDto): Promise<UserEntity[]> {
		const { page, pageSize } = query.paginationQuery
		const { name, email, role} = query
		const filterQuery: FilterQuery<UserEntity> = {}
		if (name) {
			filterQuery.name = { $ilike: `%${name}%` }
		}
		if (email) {
			filterQuery.email = { $ilike: `%${email}%` }
		}
		if (role) {
			filterQuery.role = role
		}
		const users = await this.userRepository.findAll({
			where: filterQuery,
			offset: page * pageSize,
			limit: pageSize,
			filters: false
		})
		return users
	}

	async findOneByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.userRepository.findOne(
			{ email: email },
			{ populate: ['restaurantData.*', 'customerData.*'] }
		)

		return user
	}

	async findOneById(user_id: string): Promise<UserEntity | null> {
		return await this.userRepository.findOne(
			{ id: user_id },
			{ populate: ['restaurantData.*', 'customerData.*'] }
		)
	}

	async findDeletedUserById(user_id: string) {
		return await this.userRepository.findOne(
			{
				id: user_id
			},
			{
				filters: false
			}
		)
	}
}
