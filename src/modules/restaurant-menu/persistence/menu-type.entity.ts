import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { RestaurantMenuEntity } from "./restaurant-menu.entity";

@Entity({tableName: "menu_type"})
export class MenuTypeEntity extends BaseEntity{
    @Property()
    name: string

    @ManyToMany({
        entity: () => RestaurantMenuEntity,
        inversedBy: 'types',
        fieldName: 'menu_id'
    })
    menus = new Collection<RestaurantMenuEntity>(this)

    constructor(name: string){
        super()
        this.name = name
    }
}