import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/base.entity'
import { TransactionEntity } from '../../transaction/persistence/transaction.entity'
import { UserEntity } from '../../user/persistance/user.entity'

@Entity({ tableName: 'transaction_messages' })
export class TransactionMessageEntity extends BaseEntity {
	@Property()
	message: string

	@ManyToOne({
		entity: () => UserEntity,
		fieldName: 'user_id',
		index: true
	})
	user: UserEntity

	@ManyToOne({
		entity: () => TransactionEntity,
		inversedBy: 'messages',
		fieldName: 'transaction_id',
		index: true
	})
	transaction: TransactionEntity

	constructor(transaction: TransactionEntity, message: string) {
		super()
		this.transaction = transaction
		this.message = message
	}
}
