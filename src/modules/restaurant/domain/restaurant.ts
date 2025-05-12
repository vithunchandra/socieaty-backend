import { Point } from 'src/modules/restaurant/persistence/custom-type/point-type'
import { RestaurantTheme } from './restaurant-theme'
import { BankEnum } from '../../../enums/bank.enum'
import { RestaurantVerificationStatus } from '../../../enums/restaurant-verification-status.enum'

export class Restaurant {
	id: string
	wallet: number
	restaurantBannerUrl: string
	location: Point
	themes: RestaurantTheme[]
	openTime: string
	closeTime: string
	payoutBank: BankEnum
	accountNumber: string
	isReservationAvailable: boolean
	verificationStatus: RestaurantVerificationStatus
}
