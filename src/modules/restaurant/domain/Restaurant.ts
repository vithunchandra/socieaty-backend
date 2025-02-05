import { Point } from "src/modules/restaurant/persistence/custom-type/PointType"
import { RestaurantTheme } from "./restaurant-theme"
import { BankEnum } from "../../../enums/bank.enum"

export class Restaurant{
    restaurantBannerUrl: string
    location: Point
    themes: RestaurantTheme[]
    payoutBank: BankEnum
    accountNumber: string
}