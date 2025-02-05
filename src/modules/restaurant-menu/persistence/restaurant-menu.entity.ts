import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";
import { RestaurantEntity } from "../../restaurant/persistence/Restaurant.entity";
import { MenuTypeEntity } from "./menu-type.entity";

@Entity({tableName: "restaurant_menu"})
export class RestaurantMenuEntity extends BaseEntity{
    @Property()
    name: string
    
    @Property()
    price: number

    @Property()
    description: string

    @Property()
    menuPictureUrl: string

    @ManyToMany({
        entity: () => MenuTypeEntity,
        mappedBy: 'menus',
        fieldName: 'menu_id'
    })
    types = new Collection<MenuTypeEntity>(this)
    
    @ManyToOne({
        entity: () => RestaurantEntity,
        fieldName: 'restaurant_id',
        inversedBy: 'menus',
    })
    restaurant: RestaurantEntity

    constructor(restaurant: RestaurantEntity, name: string, price: number, description: string, menuPictureUrl: string) {
        super()
        this.restaurant = restaurant
        this.name = name
        this.price = price
        this.description = description
        this.menuPictureUrl = menuPictureUrl
    }
}