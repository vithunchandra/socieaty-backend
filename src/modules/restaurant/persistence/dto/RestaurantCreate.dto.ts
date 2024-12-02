import { Point } from "src/modules/restaurant/persistence/custom-type/PointType"

export interface CreateRestaurantDto{
    userId: string
    restaurantName: string
    restaurantAddress: Point
    restaurantPhotoUrl: string
}