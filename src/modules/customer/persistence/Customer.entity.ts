import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { UserEntity } from "../../user/persistance/User.entity";

@Entity({tableName: "customer"})
export class CustomerEntity extends BaseEntity{
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
    userData: UserEntity

    constructor(user: UserEntity){
        super()
        this.userData = user
        this.wallet = 0
        this.bio = ""
        this.photoProfileUrl = ""
    }
}