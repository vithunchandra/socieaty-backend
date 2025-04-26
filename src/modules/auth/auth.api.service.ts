import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UserDaoService } from 'src/modules/user/persistance/User.dao.service'
import { UserSigninDto } from './dto/user-signin.dto'
import { JwtService } from '@nestjs/jwt'
import { CustomerCreateDto } from './dto/CustomerCreate.dto'
import { RestaurantCreateDto } from './dto/RestaurantCreate.dto'
import { EntityManager } from '@mikro-orm/postgresql'
import { RestaurantService } from '../restaurant/restaurant.api.service'
import { RestaurantSignupResponseDto } from './dto/restaurant-signup-response.dto'
import { CustomerSignupResponseDto } from './dto/customer-signup-responser.dto'
import { UserMapper } from '../user/domain/user.mapper'
import { CustomerService } from '../customer/customer.api.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly restaurantService: RestaurantService,
		private readonly userDao: UserDaoService,
		private readonly customerService: CustomerService,
		private readonly em: EntityManager,
		private readonly jwtService: JwtService
	) {}
	async customerSignup(data: CustomerCreateDto): Promise<CustomerSignupResponseDto> {
		if (data.password !== data.confirmPassword) {
			throw new BadRequestException('Password and confirm password is not matched')
		}

		const isExist = await this.userDao.findOneByEmail(data.email)
		if (isExist) {
			throw new BadRequestException('Email is already been taken')
		}

		const customer = await this.customerService.createCustomer(data)

		const userMapped = UserMapper.fromCustomerToDomain(customer)
		userMapped.password = undefined
		this.em.flush()
		return {
			token: await this.jwtService.signAsync({ ...userMapped }),
			user: userMapped
		}
	}

	async restaurantSignup(
		data: RestaurantCreateDto,
		profilePicture: Express.Multer.File,
		restaurantBanner: Express.Multer.File
	): Promise<RestaurantSignupResponseDto> {
		if (data.password !== data.confirmPassword) {
			throw new BadRequestException('Password and confirm password is not matched')
		}

		const isExist = await this.userDao.findOneByEmail(data.email)
		if (isExist) {
			throw new BadRequestException('Email is already been taken')
		}

		if (data.openTime >= data.closeTime) {
			throw new BadRequestException('Open time must be before close time')
		}

		const restaurant = await this.restaurantService.createRestaurant(
			data,
			profilePicture,
			restaurantBanner
		)
		const userMapped = UserMapper.fromRestaurantToDomain(restaurant)
		userMapped.password = undefined
		this.em.flush()
		return {
			token: await this.jwtService.signAsync({ ...userMapped }),
			user: userMapped
		}
	}

	async signin(data: UserSigninDto) {
		const user = await this.userDao.findOneByEmail(data.email)
		if (!user) {
			throw new BadRequestException('User not found')
		}
		if (user.password != data.password) {
			throw new BadRequestException('Wrong password')
		}

		const userMapped = UserMapper.toDomain(user)
		userMapped.password = undefined
		const payload = {
			...userMapped
		}
		this.em.flush()
		return {
			token: await this.jwtService.signAsync(payload),
			user: userMapped
		}
	}

	async getData(user_id: string) {
		const user = await this.userDao.findOneById(user_id, true)
		if (!user) {
			return new NotFoundException('User not found')
		}

		return UserMapper.toDomain(user)
	}
}
