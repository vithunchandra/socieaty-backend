import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { FoodMenuEntity } from './food-menu.entity'

@Entity({ tableName: 'menu_category' })
export class MenuCategoryEntity {
	@PrimaryKey({ autoincrement: true, type: 'int' })
	id: number

	@Property()
	name: string

	@ManyToMany({
		entity: () => FoodMenuEntity,
		inversedBy: 'categories',
		fieldName: 'menu_id'
	})
	menus = new Collection<FoodMenuEntity>(this)

	constructor(name: string) {
		this.name = name
	}
}
