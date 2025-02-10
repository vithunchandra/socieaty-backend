import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { RestaurantMenuEntity } from './restaurant-menu.entity'

@Entity({ tableName: 'menu_category' })
export class MenuCategoryEntity {
	@PrimaryKey({ autoincrement: true, type: 'int' })
	id: number

	@Property()
	name: string

	@ManyToMany({
		entity: () => RestaurantMenuEntity,
		inversedBy: 'categories',
		fieldName: 'menu_id'
	})
	menus = new Collection<RestaurantMenuEntity>(this)

	constructor(name: string) {
		this.name = name
	}
}
