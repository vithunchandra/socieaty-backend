import { CustomerEntity } from "../../customer/persistence/Customer.entity"

export class CreateTopupTransactionDto {
    orderId: string
    grossAmount: number
    customer: CustomerEntity
}
