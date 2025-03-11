import { Collection, Entity, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { UserEntity } from "../../user/persistance/User.entity";
import { TransactionReviewEntity } from "../../transaction-review/persistence/transaction-review.entity";

@Entity({tableName: "customer"})
export class CustomerEntity extends BaseEntity{
    @Property({default: "", nullable: true, type: 'text' })
    bio: string

    @Property({default: 0, nullable: false})
    wallet!: number

    @OneToOne({
        entity: () => UserEntity,
        inversedBy: 'customerData',
        fieldName: 'user_id',
    })
    userData: UserEntity

    @OneToMany({
		entity: () => TransactionReviewEntity,
		mappedBy: 'customer',
		orphanRemoval: true
	})
	reviews = new Collection<TransactionReviewEntity>(this)

    constructor(userData: UserEntity){
        super()
        this.userData = userData
        this.wallet = 0
        this.bio = ""
    }
}