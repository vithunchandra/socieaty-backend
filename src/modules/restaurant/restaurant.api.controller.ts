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

	@Post('reservation-config')
	@Roles(UserRole.RESTAURANT)
	@UseGuards(AuthGuard, RolesGuard)
	async createReservationConfig(
		@Request() req: GuardedRequestDto,
		@Body() data: CreateReservationConfigRequestDto
	) {
		return await this.restaurantService.createReservationConfig(
			req.user.restaurantData!,
			data
		)
	}

	@Put('reservation-config')
	@Roles(UserRole.RESTAURANT)
	@UseGuards(AuthGuard, RolesGuard)
	async updateReservationConfig(
		@Request() req: GuardedRequestDto,
		@Body() data: UpdateReservationConfigRequestDto
	) {
		return {
			data: await this.restaurantService.updateReservationConfig(
				req.user.restaurantData!,
				data
			)
		}
	}

	@Get('reservation-config')
	@Roles(UserRole.RESTAURANT)
	@UseGuards(AuthGuard, RolesGuard)
	async getReservationConfig(@Request() req: GuardedRequestDto) {
		return {
			data: await this.restaurantService.getReservationConfig(req.user.restaurantData!.id)
		}
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
}
