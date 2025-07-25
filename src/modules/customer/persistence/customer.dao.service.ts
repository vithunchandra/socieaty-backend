import { EntityRepository } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CustomerEntity } from './customer.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CustomerCreateDto } from './dto/customer-create.dto'
import { UserEntity } from '../../user/persistance/user.entity'
import { UpdateCustomerProfileRequestDto } from '../dto/update-customer-profile-request.dto'
import { UpdateCustomerDataDto } from './dto/update-customer-data.dto'

@Injectable()
export class CustomerDaoService {
	constructor(
		@InjectRepository(CustomerEntity)
		private readonly customerRepository: EntityRepository<CustomerEntity>
	) {}

	create(user: UserEntity, data: CustomerCreateDto): CustomerEntity {
		const customer = this.customerRepository.create({
			userData: user,
			wallet: 0,
			bio: ''
		})
		return customer
	}

	async getProfile(user_id: string): Promise<CustomerEntity | null> {
		const customer = await this.customerRepository.findOne(
			{
				userData: { id: user_id }
			},
			{ populate: ['userData'] }
		)
		return customer
	}

	updateCustomerData(customer: CustomerEntity, data: UpdateCustomerDataDto) {
		customer.bio = data.bio
		return customer
	}
}
