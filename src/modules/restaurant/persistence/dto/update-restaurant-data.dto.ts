import { BankEnum } from '../../../../enums/bank.enum'
import { RestaurantVerificationStatus } from '../../../../enums/restaurant-verification-status.enum'
import { Point } from '../custom-type/point-type'

export class UpdateRestaurantDataDto {
	restaurantAddress: Point
	restaurantBannerUrl: string
	payoutBank: BankEnum
	themes: number[]
	accountNumber: string
	openTime: string
	closeTime: string
	verificationStatus: RestaurantVerificationStatus
}
