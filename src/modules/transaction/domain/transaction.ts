import { TransactionServiceType, TransactionStatus } from "../../../enums/transaction.enum"
import { User } from "../../user/domain/User"
import { TransactionMenuItem } from "./transaction-menu-item"

export class Transaction {
    id: string
    serviceType: TransactionServiceType
    grossAmount: number
    serviceFee: number
    status: TransactionStatus
    note: string
    restaurant: User
    customer: User
}
