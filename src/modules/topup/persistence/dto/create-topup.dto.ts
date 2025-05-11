import { CustomerEntity } from '../../../customer/persistence/customer.entity'

export class CreateTopupDto {
	customer: CustomerEntity
	amount: number
}
