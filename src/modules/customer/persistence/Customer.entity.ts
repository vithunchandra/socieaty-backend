import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { UserEntity } from "../../user/persistance/User.entity";

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

    constructor(userData: UserEntity){
        super()
        this.userData = userData
        this.wallet = 0
        this.bio = ""
    }
}