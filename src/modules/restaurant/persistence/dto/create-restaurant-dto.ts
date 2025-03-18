import { Point } from 'src/modules/restaurant/persistence/custom-type/PointType'
import { BankEnum } from '../../../../enums/bank.enum'

export interface CreateRestaurantDto {
	userId: string
	restaurantAddress: Point
	restaurantBannerUrl: string
	restaurantThemes: number[]
	payoutBank: BankEnum
	accountNumber: string
	openTime: string
	closeTime: string
	isReservationAvailable: boolean
}
