import { RestaurantEntity } from "../persistence/Restaurant.entity";
import { Restaurant } from "./Restaurant";

export class RestaurantMapper{
    static toDomain(raw: RestaurantEntity | null): Restaurant | null{
        if(!raw) return null

        const restaurant = new Restaurant()
        restaurant.photoUrl = raw.photoUrl
        restaurant.location = raw.location

        return restaurant
    }
}