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
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { UserRole } from 'src/modules/user/persistance/user.entity'
import { Roles } from 'src/module/RoleGuard/roles.decorator'
import { RolesGuard } from 'src/module/RoleGuard/roles.guard'
import { RestaurantService } from './restaurant.api.service'
import { AuthGuard } from 'src/module/AuthGuard/auth-guard.service'
import { PaginateRestaurantRequestDto } from './dto/paginate-restaurant-request.dto'
import { CreateReservationConfigRequestDto } from './dto/create-reservation-config_request.dto'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { UpdateReservationConfigRequestDto } from './dto/update-reservation-config-request.dto'
import { GetNearestRestaurantRequestDto } from './dto/get-nearest-restaurant-request.dto'
import { GetAllUnverifiedRestaurantRequestQueryDto } from './dto/get-all-unverified-restaurant-request-query.dto'
import { UpdateRestaurantVerificationStatusRequestDto } from './dto/update-restaurant-verification-status-request.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { PROFILE_PICTURE_UPLOADS_DIR, RESTAURANT_BANNER_UPLOADS_DIR } from '../../constants'
import { fileNameEditor, imageFileFilter } from '../../utils/image.utils'
import { UpdateRestaurantDataRequestDto } from './dto/update-restaurant-data-request.dto'
import { ToggleReservationAvailabilityRequestDto } from './dto/toggle-reservation-availability-request.dto'

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

	@Put('reservation-availability')
	@Roles(UserRole.RESTAURANT)
	@UseGuards(AuthGuard, RolesGuard)
	async toggleReservationAvailability(
		@Request() req: GuardedRequestDto,
		@Body() data: ToggleReservationAvailabilityRequestDto
	) {
		return await this.restaurantService.toggleReservationAvailability(req.user, data.value)
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

	@Put(':restaurantId')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.RESTAURANT)
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'profilePicture', maxCount: 1 },
				{ name: 'restaurantBanner', maxCount: 1 }
			],
			{
				storage: diskStorage({
					destination: (req, file, cb) => {
						if (file.fieldname === 'profilePicture') {
							cb(null, PROFILE_PICTURE_UPLOADS_DIR)
						} else {
							cb(null, RESTAURANT_BANNER_UPLOADS_DIR)
						}
					},
					filename: fileNameEditor
				}),
				fileFilter: imageFileFilter,
				limits: {
					fieldSize: 1000 * 1000 * 10
				}
			}
		)
	)
	async updateRestaurantData(
		@Request() req: GuardedRequestDto,
		@Param('restaurantId') restaurantId: string,
		@Body() data: UpdateRestaurantDataRequestDto,
		@UploadedFiles()
		files: {
			profilePicture?: Express.Multer.File[]
			restaurantBanner?: Express.Multer.File[]
		}
	) {
		return await this.restaurantService.updateRestaurantData(
			restaurantId,
			req.user,
			data,
			files.profilePicture?.[0],
			files.restaurantBanner?.[0]
		)
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
