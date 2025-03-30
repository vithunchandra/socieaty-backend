import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	Request,
	Res,
	StreamableFile,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { AuthGuard } from '../../module/AuthGuard/AuthGuard.service'
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { UserRole } from '../user/persistance/User.entity'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { UpdateReservationRequestDto } from './dto/update-reservation-request.dto'
import { GetRestaurantReservationsQueryDto } from './dto/get_restaurant_reservations.dto'
import { GetCustomerReservationsDto } from './dto/get_customer_reservations.dto'

@Controller('reservation')
export class ReservationController {
	constructor(private readonly reservationService: ReservationService) {}

	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async createReservation(
		@Request() req: GuardedRequestDto,
		@Body() dto: CreateReservationRequestDto
	) {
		if (!req.user.customerData) {
			throw new UnauthorizedException('Customer data not found')
		}
		return this.reservationService.createReservation(req.user.customerData, dto)
	}

	@Get('/restaurant')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.RESTAURANT)
	async getRestaurantReservations(
		@Request() req: GuardedRequestDto,
		@Query() query: GetRestaurantReservationsQueryDto
	) {
		return this.reservationService.getRestaurantReservations(
			req.user.restaurantData!,
			query.status
		)
	}

	@Get('/customer')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async getCustomerReservations(
		@Request() req: GuardedRequestDto,
		@Query() query: GetCustomerReservationsDto
	) {
		return this.reservationService.getCustomerReservations(req.user.customerData!, query)
	}

	@Put(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.RESTAURANT)
	async updateReservation(
		@Request() req: GuardedRequestDto,
		@Param('id') id: string,
		@Body() dto: UpdateReservationRequestDto
	) {
		return this.reservationService.updateReservation(id, req.user.restaurantData!, dto)
	}

	@Get(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER, UserRole.RESTAURANT)
	async getReservation(@Request() req: GuardedRequestDto, @Param('id') id: string) {
		return this.reservationService.getReservationById(id, req.user)
	}

	@Post(':id/scan')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.RESTAURANT)
	async scanCustomerReservation(@Request() req: GuardedRequestDto, @Param('id') id: string) {
		return this.reservationService.scanCustomerReservation(req.user.restaurantData!, id)
	}

	@Get(':id/track')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER, UserRole.RESTAURANT)
	async trackReservation(@Request() req: GuardedRequestDto, @Param('id') id: string) {
		return this.reservationService.trackReservation(id, req.user)
	}

	@Get(':id/qr-code')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER, UserRole.RESTAURANT)
	async generateQRCode(@Request() req: GuardedRequestDto, @Param('id') id: string) {
		return this.reservationService.generateQRCode(req.user, id)
	}
}
