import { BaseEntity, Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BankEnum } from "../../../enums/bank.enum";
import { RestaurantEntity } from "../../restaurant/persistence/entity/Restaurant.entity";

@Entity({ tableName: 'withdraws' })
export class WithdrawEntity extends BaseEntity {
    @Property()
    amount: number

    @Property()
    status: string

    @Enum(() => BankEnum)
    bank: BankEnum

    @Property()
	accountNumber: string

    @Property()
    referenceNo: string

    @ManyToOne({
        entity: () => RestaurantEntity,
    })
    restaurant: RestaurantEntity
}
