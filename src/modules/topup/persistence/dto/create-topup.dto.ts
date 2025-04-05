import { CustomerEntity } from "../../../customer/persistence/Customer.entity";

export class CreateTopupDto {
    customer: CustomerEntity
    amount: number
}
