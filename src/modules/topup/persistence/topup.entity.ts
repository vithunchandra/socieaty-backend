import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { CustomerEntity } from "../../customer/persistence/Customer.entity";
import { TopupStatusEnum } from "../../../enums/topup-status.enum";
import { BaseEntity } from "../../../database/model/base/Base.entity";

@Entity({ tableName: 'topups' })
export class TopupEntity extends BaseEntity {
    @Property()
    transactionId?: string

    @Property()
    amount: number

    @Enum(() => TopupStatusEnum)
    status: TopupStatusEnum

    @Property()
    paymentType?: string

    @Property()
    settlementTime?: Date

    @ManyToOne({
        entity: () => CustomerEntity,
    })
    customer: CustomerEntity
}
