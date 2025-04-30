import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Post,
	Put,
	Query,
	Request,
	UseGuards
} from '@nestjs/common'
import { UserRole } from 'src/modules/user/persistance/User.entity'
import { Roles } from 'src/module/RoleGuard/roles.decorator'
import { RolesGuard } from 'src/module/RoleGuard/roles.guard'
import { RestaurantService } from './restaurant.api.service'
import { AuthGuard } from 'src/module/AuthGuard/AuthGuard.service'
import { PaginateRestaurantRequestDto } from './dto/paginate-restaurant-request.dto'
import { CreateReservationConfigRequestDto } from './dto/create-reservation-config_request.dto'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { UpdateReservationConfigRequestDto } from './dto/update-reservation-config-request.dto'
import { GetNearestRestaurantRequestDto } from './dto/get-nearest-restaurant-request.dto'
import { GetAllUnverifiedRestaurantRequestQueryDto } from './dto/get-all-unverified-restaurant-request-query.dto'
import { UpdateRestaurantVerificationStatusRequestDto } from './dto/update-restaurant-verification-status-request.dto'

@Controller('restaurant')
export class RestaurantController {
	constructor(private restaurantService: RestaurantService) {}
	@Get('profile')
	@Roles(UserRole.RESTAURANT)
	@UseGuards(AuthGuard, RolesGuard)
	async getProfile(@Request() req) {
		return {
			data: await this.restaurantService.getProfile(req.user.id)
		}
	}

	@Get('unverified')
	@Roles(UserRole.ADMIN)
	@UseGuards(AuthGuard, RolesGuard)
	async getAllUnverifiedRestaurant(@Query() query: GetAllUnverifiedRestaurantRequestQueryDto) {
		return await this.restaurantService.getAllUnverifiedRestaurant(query)
	}

	@Post('reservation-config')
	@Roles(UserRole.RESTAURANT)
	@UseGuards(AuthGuard, RolesGuard)
	async createReservationConfig(
		@Request() req: GuardedRequestDto,
		@Body() data: CreateReservationConfigRequestDto
	) {
		return await this.restaurantService.createReservationConfig(req.user.restaurantData!, data)
	}

	@Put('reservation-config')
	@Roles(UserRole.RESTAURANT)
	@UseGuards(AuthGuard, RolesGuard)
	async updateReservationConfig(
		@Request() req: GuardedRequestDto,
		@Body() data: UpdateReservationConfigRequestDto
	) {
		return await this.restaurantService.updateReservationConfig(req.user.restaurantData!, data)
	}

	@Get('reservation-config/:restaurantId')
	async getReservationConfig(@Param('restaurantId') restaurantId: string) {
		return await this.restaurantService.getReservationConfig(restaurantId)
	}

	@Get('nearest')
	async getNearestRestaurant(@Query() query: GetNearestRestaurantRequestDto) {
		return await this.restaurantService.getNearestRestaurant(query)
	}

	@Get('themes')
	async getAllRestaurantThemes() {
		return await this.restaurantService.getAllRestaurantThemes()
	}

	@Get('facilities')
	async getRestaurantFacilitiesByNameLike(@Query('name') name: string) {
		return await this.restaurantService.getRestaurantFacilitiesByNameLike(name)
	}

	@Get('')
	async paginateRestaurant(@Query() query: PaginateRestaurantRequestDto) {
		return await this.restaurantService.paginateRestaurant(query)
	}

	@Get(':restaurantId')
	async getRestaurantById(@Param('restaurantId') restaurantId: string) {
		return {
			data: await this.restaurantService.getRestaurantById(restaurantId)
		}
	}

	@Put('verify/:restaurantId')
	@Roles(UserRole.ADMIN)
	@UseGuards(AuthGuard, RolesGuard)
	async updateRestaurantVerificationStatus(
		@Param('restaurantId') restaurantId: string,
		@Body() data: UpdateRestaurantVerificationStatusRequestDto
	) {
		return await this.restaurantService.updateRestaurantVerificationStatus(restaurantId, data)
	}
}
