import { Transaction } from "./transaction"
import { TransactionMenuItem } from "./transaction-menu-item"

export class FoodOrderTransaction extends Transaction {
    menuItems: TransactionMenuItem[]
}