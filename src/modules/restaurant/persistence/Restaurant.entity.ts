import { Entity, Index, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { UserEntity } from "../../user/persistance/User.entity";
import { Point, PointType } from "./custom-type/PointType";

@Entity({tableName: "restaurant"})
export class RestaurantEntity extends BaseEntity{
    @Property({default: "", nullable: true})
    photoUrl: string

    @Property({type: PointType})
    location: Point

    @OneToOne({
        entity: () => UserEntity,
        fieldName: 'user_id',
        index: true
    })
    userData: UserEntity
    
    constructor(user: UserEntity, restaurantPhotoUrl: string, restaurantAddress: Point){
        super()
        this.userData = user
        this.photoUrl = restaurantPhotoUrl
        this.location = restaurantAddress
    }
}