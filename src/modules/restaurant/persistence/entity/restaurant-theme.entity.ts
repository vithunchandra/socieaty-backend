import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../../database/model/base/Base.entity'
import { RestaurantEntity } from './restaurant.entity'

@Entity({ tableName: 'restaurant_theme' })
export class RestaurantThemeEntity {
	@PrimaryKey({ autoincrement: true, type: 'int' })
	id: number

	@Property()
	name: string

	@ManyToMany({
		entity: () => RestaurantEntity,
		inversedBy: 'themes',
		fieldName: 'restaurant_id'
	})
	restaurants = new Collection<RestaurantEntity>(this)

	constructor(name: string) {
		this.name = name
	}
}
