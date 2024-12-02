import { RestaurantEntity } from "../persistence/Restaurant.entity";
import { Restaurant } from "./Restaurant";

export class RestaurantMapper{
    static toDomain(raw: RestaurantEntity): Restaurant{
        const restaurant = new Restaurant()
        restaurant.id = raw.userData.id
        restaurant.name = raw.name
        restaurant.photoUrl = raw.photoUrl
        restaurant.location = raw.location
        restaurant.phoneNumber = raw.userData.phoneNumber
        restaurant.email = raw.userData.email
        restaurant.password = raw.userData.password
        restaurant.role = raw.userData.role

        return restaurant
    }
}