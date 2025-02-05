import { RestaurantEntity } from "../../../restaurant/persistence/Restaurant.entity"

export class CreateRestaurantMenuDto{
    name: string
    price: number
    description: string
    menuPictureUrl: string
    types: string[]
    restaurant: RestaurantEntity
}