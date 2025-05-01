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

	async paginateUsers(query: PaginateUsersQueryDto) {
		const { page, pageSize } = query.paginationQuery
		const { searchQuery, role, includeDeleted } = query
		const filterQuery: FilterQuery<UserEntity> = {}
		let isFilterActive = true

		if (searchQuery && searchQuery.length > 0) {
			filterQuery.$or = [
				{ name: { $ilike: `%${searchQuery}%` } },
				{ email: { $ilike: `%${searchQuery}%` } }
			]
		}
		if (role) {
			filterQuery.role = role
		}
		if (includeDeleted) {
			isFilterActive = false
		}
		const [items, count] = await this.userRepository.findAndCount(filterQuery, {
			offset: page * pageSize,
			limit: pageSize,
			filters: false,
			populate: ['restaurantData.*', 'customerData.*']
		})
		return {
			items,
			count
		}
	}

	async findOneByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.userRepository.findOne(
			{ email: email },
			{
				populate: ['restaurantData.*', 'customerData.*'],
				filters: { isAccountVerified: false }
			}
		)

		return user
	}

	async findOneById(user_id: string, isFilterActive: boolean): Promise<UserEntity | null> {
		return await this.userRepository.findOne(
			{ id: user_id },
			{ populate: ['restaurantData.*', 'customerData.*'], filters: isFilterActive }
		)
	}
}
