import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { UserEntity } from "../../user/persistance/User.entity";
import { Point, PointType } from "./custom-type/PointType";

@Entity({tableName: "restaurant"})
export class RestaurantEntity extends BaseEntity{
    @Property()
    name!: string

    @Property({default: "", nullable: true})
    photoUrl: string

    @Property({type: PointType})
    location?: Point

    @OneToOne({
        entity: () => UserEntity,
        fieldName: 'user_id'
    })
    userData: UserEntity | null = null
    
    constructor(user: UserEntity, restaurantName: string, restaurantPhotoUrl: string, restaurantAddress: Point){
        super()
        this.userData = user
        this.name = restaurantName
        this.photoUrl = restaurantPhotoUrl
        this.location = restaurantAddress
    }
}