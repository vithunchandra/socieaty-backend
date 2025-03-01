import { Body, Controller, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { AuthGuard } from '../../module/AuthGuard/AuthGuard.service'
import { CreateOrderTransactionRequestDto } from './dto/create-order-transaction-request.dto'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { UserRole } from '../user/persistance/User.entity'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { UpdateOrderTransactionRequestDto } from './dto/update-order-transaction-request.dto'

@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post('order')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async createOrderTransaction(
		@Body() dto: CreateOrderTransactionRequestDto,
		@Req() req: GuardedRequestDto
	) {
		if (!req.user.customerData) {
			throw new UnauthorizedException('Customer not found')
		}
		return this.transactionService.createTransaction(req.user.customerData!, dto)
	}

	@Put('order/:id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.RESTAURANT)
	async updateOrderTransaction(@Param('id') id: string, @Body() dto: UpdateOrderTransactionRequestDto, @Req() req: GuardedRequestDto) {
		if (!req.user.restaurantData) {
			throw new UnauthorizedException('Restaurant not found')
		}
		return this.transactionService.updateOrderTransaction(id, req.user.restaurantData!, dto)
	}
}
