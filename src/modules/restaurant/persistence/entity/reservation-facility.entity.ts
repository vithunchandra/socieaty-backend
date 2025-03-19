import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../../database/model/base/Base.entity";
import { ReservationConfigEntity } from "./reservation-config.entity";

@Entity({ tableName: "reservation_facility" })
export class ReservationFacilityEntity extends BaseEntity{
    @Property()
    name: string

    @ManyToMany({
        entity: () => ReservationConfigEntity,
        inversedBy: 'facilities',
        index: true
    })
    reservationConfigs = new Collection<ReservationConfigEntity>(this)

    constructor(name: string){
        super()
        this.name = name
    }
}