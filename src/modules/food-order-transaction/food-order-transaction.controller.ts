import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { FoodOrderTransactionService } from './food-order-transaction.service'
import { AuthGuard } from '../../module/AuthGuard/AuthGuard.service'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { UserRole } from '../user/persistance/User.entity'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { CreateFoodOrderTransactionRequestDto } from './dto/create-order-transaction-request.dto'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { GetRestaurantFoodTransactionQueryDto } from './dto/get_restaurant_food_transaction_query.dto'
import { UpdateFoodOrderTransactionRequestDto } from './dto/update-food-order-transaction-request.dto'
import { GetAllCustomerFoodTransactionQueryDto } from './dto/get_all_customer_food_transaction_query.dto'

@Controller('food-orders')
export class FoodOrderTransactionController {
	constructor(private readonly foodOrderTransactionService: FoodOrderTransactionService) {}

	@Post('')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async createFoodOrderTransaction(
		@Req() req: GuardedRequestDto,
		@Body() dto: CreateFoodOrderTransactionRequestDto
	) {
		const foodOrderTransaction =
			await this.foodOrderTransactionService.createFoodOrderTransaction(
				req.user.customerData!,
				dto
			)
		return foodOrderTransaction
	}

	@Get('/restaurant')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.RESTAURANT)
	async findRestaurantFoodOrderTransaction(
		@Req() req: GuardedRequestDto,
		@Query() query: GetRestaurantFoodTransactionQueryDto
	) {
		console.log('Test')
		if (!req.user.restaurantData) {
			throw new UnauthorizedException('Restaurant not found')
		}
		return this.foodOrderTransactionService.findRestaurantFoodOrderTransactions(
			req.user.restaurantData!,
			query.status
		)
	}

	@Get('/customer')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async findCustomerFoodOrderTransaction(
		@Req() req: GuardedRequestDto,
		@Query() query: GetAllCustomerFoodTransactionQueryDto
	) {
		if (!req.user.customerData) {
			throw new UnauthorizedException('Customer not found')
		}
		return this.foodOrderTransactionService.findCustomerFoodOrderTransaction(
			req.user.customerData!,
			query.status
		)
	}

	@Put('/:id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.RESTAURANT)
	async updateOrderTransaction(
		@Param('id') id: string,
		@Body() dto: UpdateFoodOrderTransactionRequestDto,
		@Req() req: GuardedRequestDto
	) {
		if (!req.user.restaurantData) {
			throw new UnauthorizedException('Restaurant not found')
		}
		return this.foodOrderTransactionService.updateFoodOrderTransaction(
			id,
			req.user.restaurantData!,
			dto
		)
	}

	@Get(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async findFoodOrderTransactionByOrderId(
		@Param('id') id: string,
		@Req() req: GuardedRequestDto
	) {
		if (!req.user.customerData) {
			throw new UnauthorizedException('Customer not found')
		}
		return this.foodOrderTransactionService.findFoodOrderTransactionByOrderId(id, req.user)
	}

	

	@Get(':id/track')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async trackOrder(@Param('id') id: string, @Req() req: GuardedRequestDto) {
		return this.foodOrderTransactionService.trackOrder(id, req.user)
	}
}
