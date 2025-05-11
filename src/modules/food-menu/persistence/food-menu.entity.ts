import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { RestaurantEntity } from '../../restaurant/persistence/entity/restaurant.entity'
import { MenuCategoryEntity } from './menu-category.entity'

@Entity({ tableName: 'food_menu' })
export class FoodMenuEntity extends BaseEntity {
	@Property()
	name: string

	@Property()
	price: number

	@Property()
	description: string

	@Property()
	pictureUrl: string

	@Property()
	estimatedTime: number

	@Property({ default: true })
	isStockAvailable: boolean

	@ManyToMany({
		entity: () => MenuCategoryEntity,
		mappedBy: 'menus',
		fieldName: 'menu_id'
	})
	categories = new Collection<MenuCategoryEntity>(this)

	@ManyToOne({
		entity: () => RestaurantEntity,
		fieldName: 'restaurant_id',
		inversedBy: 'menus'
	})
	restaurant: RestaurantEntity

	constructor(
		restaurant: RestaurantEntity,
		name: string,
		price: number,
		description: string,
		menuPictureUrl: string,
		estimatedTime: number
	) {
		super()
		this.restaurant = restaurant
		this.name = name
		this.price = price
		this.description = description
		this.pictureUrl = menuPictureUrl
		this.estimatedTime = estimatedTime
		this.isStockAvailable = true
	}
}
