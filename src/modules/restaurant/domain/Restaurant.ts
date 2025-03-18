import { Point } from 'src/modules/restaurant/persistence/custom-type/PointType'
import { RestaurantTheme } from './restaurant-theme'
import { BankEnum } from '../../../enums/bank.enum'

export class Restaurant {
	id: string
	restaurantBannerUrl: string
	location: Point
	themes: RestaurantTheme[]
	openTime: string
	closeTime: string
	payoutBank: BankEnum
	accountNumber: string
	isReservationAvailable: boolean
}
