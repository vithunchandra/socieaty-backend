import { ReservationStatus } from "../../../../enums/reservation.enum"

export class CreateReservationDto {
    transactionId: string
    reservationTime: Date
    endTimeEstimation: Date
    peopleSize: number
    status: ReservationStatus
}

