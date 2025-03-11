import { FoodMenuEntity } from "../../../food-menu/persistence/food-menu.entity";

export class FoodMenuCartDto{
    menu: FoodMenuEntity
    quantity: number

    constructor(menu: FoodMenuEntity, quantity: number) {
        this.menu = menu
        this.quantity = quantity
    }
}