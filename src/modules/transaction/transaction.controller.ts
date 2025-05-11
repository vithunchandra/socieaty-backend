import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { PaginateTransactionsRequestQueryDto } from './dto/paginate-transactions-request-query.dto'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { AuthGuard } from '../../module/AuthGuard/AuthGuard.service'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { UserRole } from '../user/persistance/user.entity'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { GetTransactionsChartDataRequestDto } from './dto/get-transactions-chart-data-request.dto'
import { GetTransactionsInsightRequestQueryDto } from './dto/get-transactions-insight-request-query.dto'
@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Get()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.RESTAURANT)
	async paginateTransactions(
		@Request() req: GuardedRequestDto,
		@Query() query: PaginateTransactionsRequestQueryDto
	) {
		return this.transactionService.paginateTransactions(req.user, query)
	}

	@Get('insight')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.RESTAURANT)
	async getTransactionsInsight(
		@Request() req: GuardedRequestDto,
		@Query() query: GetTransactionsInsightRequestQueryDto
	) {
		return this.transactionService.getTransactionsInsight(req.user, query)
	}

	@Get('chart')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.RESTAURANT)
	async getTransactionsChartData(
		@Request() req: GuardedRequestDto,
		@Query() query: GetTransactionsChartDataRequestDto
	) {
		return this.transactionService.getTransactionsChartData(req.user, query)
	}
}
