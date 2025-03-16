import { ArrayType, Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/Base.entity";

@Entity({ tableName: 'reservation_configs' })
export class ReservationConfig extends BaseEntity{
    @Property()
    maxPerson: number

    @Property()
    minCostPerPerson: number

    @Property()
    timeLimit: number

    @Property({type: ArrayType})
    facilities: string[]
}

//buat saja schedule secera otomatis yang mana mempunyai interval sesuai dengan timeLimit dan jam buka restaurant
//untuk total seats tidak perlu berikan tanggung jawab itu ke restaurant. mereka yang atur.
//jadi jumlah seats itu dynamic dan dari total jumlah pesanan pada jadwal tersebut.