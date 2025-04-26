import { HiddenProps, Index, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core'
import { v7 } from 'uuid'

export abstract class BaseEntity<Optional = never> {
	[OptionalProps]?: 'createdAt' | 'updatedAt' | 'deletedAt' | Optional

	@PrimaryKey({ type: 'uuid' })
	id!: string

	@Property({ hidden: true })
	createdAt: Date = new Date()

	@Property({ hidden: true, onUpdate: () => new Date() })
	updatedAt: Date = new Date()

	@Property({ nullable: true })
	deletedAt?: Date

	constructor() {
		this.id = v7()
	}
}
