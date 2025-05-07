import { ReservationStatus } from "../../../enums/reservation.enum";
import { MenuItem } from "../../menu-items/domain/food-order-menu-item";
import { BaseTransaction } from "../../transaction/domain/transaction";

export class ReservationTransaction extends BaseTransaction {
    reservationId: string
    reservationStatus: ReservationStatus
    reservationTime: Date
    endTimeEstimation: Date
    peopleSize: number
    menuItems: MenuItem[]
}