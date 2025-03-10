import { UserMapper } from "../../user/domain/user.mapper";
import { TransactionMenuItemEntity } from "../persistence/entity/transaction-menu-item.entity";
import { TransactionEntity } from "../persistence/entity/transaction.entity";
import { FoodOrderTransaction } from "./food-order-transaction";
import { Transaction } from "./transaction";
import { TransactionMenuItemMapper } from "./transaction-menu-item.mapper";

export class TransactionMapper {
    static toDomain(raw: TransactionEntity): Transaction {
        const transaction = new Transaction()
        transaction.id = raw.id
        transaction.serviceType = raw.serviceType
        transaction.grossAmount = raw.grossAmount
        transaction.serviceFee = raw.serviceFee
        transaction.status = raw.status
        transaction.restaurant = UserMapper.fromRestaurantToDomain(raw.restaurant)
        transaction.customer = UserMapper.fromCustomerToDomain(raw.customer)
        return transaction
    }

    static toFoodOrderTransaction(raw: TransactionEntity, menuItems: TransactionMenuItemEntity[]): FoodOrderTransaction {
        const foodOrderTransaction = new FoodOrderTransaction()
        foodOrderTransaction.id = raw.id
        foodOrderTransaction.serviceType = raw.serviceType
        foodOrderTransaction.grossAmount = raw.grossAmount
        foodOrderTransaction.serviceFee = raw.serviceFee
        foodOrderTransaction.status = raw.status
        foodOrderTransaction.note = raw.note
        foodOrderTransaction.restaurant = UserMapper.fromRestaurantToDomain(raw.restaurant)
        foodOrderTransaction.customer = UserMapper.fromCustomerToDomain(raw.customer)
        foodOrderTransaction.menuItems = menuItems.map(item => TransactionMenuItemMapper.toDomain(item))
        return foodOrderTransaction
    }
}

