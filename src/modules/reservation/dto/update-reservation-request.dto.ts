import { IsEnum } from "class-validator";
import { ReservationStatus } from "../../../enums/reservation.enum";
import { Type } from "class-transformer";

export class UpdateReservationRequestDto {
    @IsEnum(ReservationStatus)
    status: ReservationStatus
}
