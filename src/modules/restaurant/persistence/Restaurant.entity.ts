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
import { RestaurantMenuEntity } from '../../restaurant-menu/persistence/restaurant-menu.entity'
import { BankEnum } from '../../../enums/bank.enum'

@Entity({ tableName: 'restaurant' })
export class RestaurantEntity extends BaseEntity {
	@Property({ default: '', nullable: true })
	restaurantBannerUrl: string

	@Property({ type: PointType })
	location: Point

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
		entity: () => RestaurantMenuEntity,
		mappedBy: 'restaurant',
        orphanRemoval: true
	})
	menus: Collection<RestaurantMenuEntity>

	constructor(
		userData: UserEntity,
		restaurantBannerUrl: string,
		restaurantAddress: Point
	) {
		super()
		this.userData = userData
		this.restaurantBannerUrl = restaurantBannerUrl
		this.location = restaurantAddress
	}
}
