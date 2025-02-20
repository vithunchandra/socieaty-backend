import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { UserEntity } from './User.entity'
import { EntityRepository } from '@mikro-orm/postgresql'
import { UserCreateDto } from './dto/UserDao.dto'
import { UpdateUserDataDto } from './dto/update-user-data.dto'

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
}
