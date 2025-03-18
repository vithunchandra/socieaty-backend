import { Type } from "class-transformer"
import { IsArray, IsDate, IsNumber, IsString } from "class-validator"

export class CreateReservationRequestDto {
    @IsString()
    restaurantId: string
    
    @IsDate()
    @Type(() => Date)
    reservationTime: Date

    @IsNumber()
    @Type(() => Number)
    peopleSize: number

    @IsString()
    note: string

    @IsArray()
	@Type(() => ReservationMenuItem)
    menuItems: ReservationMenuItem[]
}

class ReservationMenuItem {
	@IsString()
	menuId: string

	@IsNumber()
	quantity: number
}