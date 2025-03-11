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
import { TransactionService } from './transaction.service'
import { AuthGuard } from '../../module/AuthGuard/AuthGuard.service'
import { CreateFoodOrderTransactionRequestDto } from '../food-order-transaction/dto/create-order-transaction-request.dto'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { UserRole } from '../user/persistance/User.entity'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { UpdateFoodOrderTransactionRequestDto } from '../food-order-transaction/dto/update-food-order-transaction-request.dto'
import { GetRestaurantFoodTransactionQueryDto } from '../food-order-transaction/dto/get_restaurant_food_transaction_query.dto'

@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	// @Post('order')
	// @UseGuards(AuthGuard, RolesGuard)
	// @Roles(UserRole.CUSTOMER)
	// async createOrderTransaction(
	// 	@Body() dto: CreateFoodOrderTransactionRequestDto,
	// 	@Req() req: GuardedRequestDto
	// ) {
	// 	if (!req.user.customerData) {
	// 		throw new UnauthorizedException('Customer not found')
	// 	}
	// 	return this.transactionService.createTransaction(req.user.customerData!, dto)
	// }

	// @Get('order/restaurant')
	// @UseGuards(AuthGuard, RolesGuard)
	// @Roles(UserRole.RESTAURANT)
	// async findRestaurantFoodOrderTransaction(
	// 	@Req() req: GuardedRequestDto,
	// 	@Query() query: GetRestaurantFoodTransactionQueryDto
	// ) {
	// 	if (!req.user.restaurantData) {
	// 		throw new UnauthorizedException('Restaurant not found')
	// 	}
	// 	return this.transactionService.findRestaurantFoodOrderTransaction(
	// 		req.user.restaurantData!,
	// 		query.status
	// 	)
	// }

	// @Put('order/:id')
	// @UseGuards(AuthGuard, RolesGuard)
	// @Roles(UserRole.RESTAURANT)
	// async updateOrderTransaction(
	// 	@Param('id') id: string,
	// 	@Body() dto: UpdateFoodOrderTransactionRequestDto,
	// 	@Req() req: GuardedRequestDto
	// ) {
	// 	if (!req.user.restaurantData) {
	// 		throw new UnauthorizedException('Restaurant not found')
	// 	}
	// 	return this.transactionService.updateOrderTransaction(id, req.user.restaurantData!, dto)
	// }

	// @Get('order/:id')
	// @UseGuards(AuthGuard, RolesGuard)
	// @Roles(UserRole.CUSTOMER)
	// async findFoodOrderTransactionByOrderId(
	// 	@Param('id') id: string,
	// 	@Req() req: GuardedRequestDto
	// ) {
	// 	if (!req.user.customerData) {
	// 		throw new UnauthorizedException('Customer not found')
	// 	}
	// 	return this.transactionService.findFoodOrderTransactionByOrderId(id, req.user)
	// }

	// @Get('order/:id/track')
	// @UseGuards(AuthGuard, RolesGuard)
	// @Roles(UserRole.CUSTOMER)
	// async trackOrder(@Param('id') id: string, @Req() req: GuardedRequestDto) {
	// 	return this.transactionService.trackOrder(id, req.user)
	// }
}
