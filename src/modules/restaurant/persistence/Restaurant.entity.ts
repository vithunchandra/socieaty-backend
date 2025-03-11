import {
	Collection,
	Entity,
	Enum,
	ManyToMany,
	OneToMany,
	OneToOne,
	Property
} from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { UserEntity } from '../../user/persistance/User.entity'
import { Point, PointType } from './custom-type/PointType'
import { RestaurantThemeEntity } from './restaurant-theme.entity'
import { FoodMenuEntity } from '../../food-menu/persistence/food-menu.entity'
import { BankEnum } from '../../../enums/bank.enum'
import { TransactionReviewEntity } from '../../transaction-review/persistence/transaction-review.entity'

@Entity({ tableName: 'restaurant' })
export class RestaurantEntity extends BaseEntity {
	@Property({ default: '', nullable: true })
	restaurantBannerUrl: string

	@Property({ type: PointType })
	location: Point

	@Property()
	openTime: string

	@Property()
	closeTime: string

	@Enum(() => BankEnum)
	payoutBank: BankEnum

	@Property()
	accountNumber: string

	@OneToOne({
		entity: () => UserEntity,
		inversedBy: 'restaurantData',
		fieldName: 'user_id',
		index: true
	})
	userData: UserEntity

	@ManyToMany({
		entity: () => RestaurantThemeEntity,
		mappedBy: 'restaurants',
		fieldName: 'restaurant_id'
	})
	themes: Collection<RestaurantThemeEntity>

	@OneToMany({
		entity: () => FoodMenuEntity,
		mappedBy: 'restaurant',
		orphanRemoval: true
	})
	menus: Collection<FoodMenuEntity>

	// @OneToMany({
	// 	entity: () => TransactionReviewEntity,
	// 	mappedBy: 'restaurant',
	// 	orphanRemoval: true
	// })
	// reviews: Collection<TransactionReviewEntity>

	constructor(userData: UserEntity, restaurantBannerUrl: string, restaurantAddress: Point) {
		super()
		this.userData = userData
		this.restaurantBannerUrl = restaurantBannerUrl
		this.location = restaurantAddress
	}
}
