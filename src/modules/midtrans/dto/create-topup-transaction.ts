import { CustomerEntity } from '../../customer/persistence/customer.entity'

export class CreateTopupTransactionDto {
	orderId: string
	grossAmount: number
	customer: CustomerEntity
}
