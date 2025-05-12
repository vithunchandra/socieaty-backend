import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CustomerDaoService } from './persistence/customer.dao.service'
import { UserDaoService } from '../user/persistance/user.dao.service'
import { CustomerCreateDto } from '../auth/dto/customer-create-request.dto'
import { UserMapper } from '../user/domain/user.mapper'
import { UpdateCustomerProfileRequestDto } from './dto/update-customer-profile-request.dto'
import { unlink } from 'fs'
import { EntityManager } from '@mikro-orm/postgresql'
import constants from '../../constants'
import { UserRole } from '../user/persistance/user.entity'

@Injectable()
export class CustomerService {
	constructor(
		private readonly customerDao: CustomerDaoService,
		private readonly userDao: UserDaoService,
		private readonly em: EntityManager
	) {}

	async createCustomer(data: CustomerCreateDto) {
		const user = this.userDao.create({
			name: data.name,
			email: data.email,
			password: data.password,
			phoneNumber: data.phoneNumber,
			role: data.role
		})
		const customer = this.customerDao.create(user, {})
		return customer
	}

	async getProfile(user_id: string) {
		const user = await this.customerDao.getProfile(user_id)
		if (!user) {
			return new BadRequestException('User tidak ditemukan')
		}
		const userMapped = UserMapper.fromCustomerToDomain(user)
		userMapped.password = undefined
		return userMapped
	}

	async updateProfile(
		user_id: string,
		data: UpdateCustomerProfileRequestDto,
		profilePicture?: Express.Multer.File
	) {
		const user = await this.userDao.findOneById(data.profileUserId, true)
		if (!user) {
			return new NotFoundException('User tidak ditemukan')
		}
		if (
			data.profileUserId !== user_id &&
			user.role !== UserRole.CUSTOMER &&
			!user.customerData
		) {
			return new BadRequestException('User tidak memiliki akses untuk mengupdate profile ini')
		}

		if (profilePicture) {
			if (user.profilePictureUrl && !user.profilePictureUrl.includes('dummy')) {
				unlink(`src/${user.profilePictureUrl}`, (err) => {
					if (err) throw new BadRequestException('Error saat mengupdate profile picture')
				})
			}
		}

		this.userDao.update(user, {
			...data,
			profilePictureUrl: profilePicture
				? `${constants().PROFILE_PICTURE_RELATIVE_URL}/${profilePicture.filename}`
				: (user.profilePictureUrl ?? undefined)
		})

		this.customerDao.updateCustomerData(user.customerData!, {
			bio: data.bio
		})

		await this.em.flush()
		const updatedUser = await this.userDao.findOneById(user_id, true)
		return {
			updatedUser: UserMapper.toDomain(updatedUser!)
		}
	}
}
