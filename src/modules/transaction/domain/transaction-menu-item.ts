import { FoodMenu } from "../../food-menu/domain/food-menu"

export class TransactionMenuItem {
    id: string
    menu: FoodMenu
    quantity: number
    price: number
    totalPrice: number
}
