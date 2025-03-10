import { Entity, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { RestaurantEntity } from "../../restaurant/persistence/Restaurant.entity";
import { TransactionEntity } from "../../transaction/persistence/entity/transaction.entity";
import { UserEntity } from "../../user/persistance/User.entity";

@Entity({ tableName: "restaurant_reviews" })
export class RestaurantReviewEntity extends BaseEntity{
    @Property()
    rating: number
    
    @Property()
    review: string

    @OneToOne({
        entity: () => TransactionEntity,
        inversedBy: 'review',
        fieldName: 'transaction_id',
        index: true
    })
    transaction: TransactionEntity

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: 'reviews',
        fieldName: 'user_id',
        index: true
    })
    user: UserEntity

    @ManyToOne({
        entity: () => RestaurantEntity,
        inversedBy: 'reviews',
        fieldName: 'restaurant_id',
        index: true
    })
    restaurant: RestaurantEntity
}
