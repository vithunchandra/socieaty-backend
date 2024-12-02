import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { UserEntity } from "../../user/persistance/User.entity";

@Entity()
export class Customer extends BaseEntity{
    // @Property({fieldName: 'user_customer_id', type: 'uuid', nullable: false})
    // userId: string

    @Property()
    name!: string

    @Property({default: "", nullable: true})
    photoProfileUrl: string

    @Property({default: "", nullable: true, type: 'text' })
    bio: string

    @Property({default: 0, nullable: false})
    wallet!: number

    @OneToOne({
        entity: () => UserEntity,
        fieldName: 'user_id',
    })
    userData: UserEntity | null = null

    constructor(user: UserEntity, name: string){
        super()
        this.userData = user
        this.name = name
        this.wallet = 0
    }
}