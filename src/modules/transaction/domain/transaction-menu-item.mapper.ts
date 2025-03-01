import { FoodMenuMapper } from "../../food-menu/domain/food-menu.mapper"
import { TransactionMenuItemEntity } from "../persistence/entity/transaction-menu-item.entity"
import { TransactionMenuItem } from "./transaction-menu-item"

export class TransactionMenuItemMapper {
    static toDomain(raw: TransactionMenuItemEntity): TransactionMenuItem {
        const transactionMenuItem = new TransactionMenuItem()
        transactionMenuItem.id = raw.id
        transactionMenuItem.menu = FoodMenuMapper.toDomain(raw.menu)!
        transactionMenuItem.quantity = raw.quantity
        transactionMenuItem.price = raw.price
        transactionMenuItem.totalPrice = raw.totalPrice
        return transactionMenuItem
    }
}
