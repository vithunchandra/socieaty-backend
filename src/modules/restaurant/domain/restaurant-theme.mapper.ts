import { RestaurantThemeEntity } from "../persistence/restaurant-theme.entity"
import { RestaurantTheme } from "./restaurant-theme"

export class RestaurantThemeMapper{
    static toDomain(raw: RestaurantThemeEntity | null): RestaurantTheme | null{
        if(!raw) return null
        
        const restaurantTheme = new RestaurantTheme()
        restaurantTheme.id = raw.id
        restaurantTheme.name = raw.name

        return restaurantTheme
    }
}