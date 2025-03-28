import { ReservationStatus } from "../../../enums/reservation.enum";

export class GetRestaurantReservationsQueryDto {
	status: ReservationStatus[]
}