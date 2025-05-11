import { CustomerEntity } from '../persistence/customer.entity'
import { Customer } from './customer'

export class CustomerMapper {
	static toDomain(raw: CustomerEntity | null): Customer | null {
		if (!raw) return null

		const customer = new Customer()
		customer.id = raw.id
		customer.wallet = raw.wallet
		customer.bio = raw.bio

		return customer
	}
}
