import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Param,
	Post,
	Req,
	UseGuards
} from '@nestjs/common'
import { CreateTransactionReviewRequestDto } from './dto/create-transaction-review-request.dto'
import { TransactionReviewService } from './transaction-review.service'
import { AuthGuard } from '../../module/AuthGuard/AuthGuard.service'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { UserRole } from '../user/persistance/User.entity'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'

@Controller('transactions/:id/review')
export class TransactionReviewController {
	constructor(private readonly transactionReviewService: TransactionReviewService) {}

	@Post('')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async createTransactionReview(
		@Param('id') id: string,
		@Req() req: GuardedRequestDto,
		@Body() data: CreateTransactionReviewRequestDto
	) {
		if (!req.user.customerData) {
			throw new ForbiddenException('User bukan customer')
		}
		return this.transactionReviewService.createTransactionReview(
			req.user.customerData,
			id,
			data
		)
	}

	@Get('/:restaurantId')
	async getRestaurantTransactionReviews(@Param('restaurantId') restaurantId: string) {
		return this.transactionReviewService.getReviewByRestaurantId(restaurantId)
	}

	@Get('/:customerId')
	async getCustomerTransactionReviews(@Param('customerId') customerId: string) {
		return this.transactionReviewService.getReviewByCustomerId(customerId)
	}

	@Get('/:transactionId')
	async getTransactionReview(@Param('transactionId') transactionId: string) {
		return this.transactionReviewService.getReviewByTransactionId(transactionId)
	}
}
