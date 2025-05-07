import { ReservationStatus } from "../../../enums/reservation.enum"
import { MenuItem } from "../../menu-items/domain/food-order-menu-item"

export class Reservation {
    reservationId: string
    reservationStatus: ReservationStatus
    reservationTime: Date
    endTimeEstimation: Date
    peopleSize: number
    menuItems: MenuItem[]
}