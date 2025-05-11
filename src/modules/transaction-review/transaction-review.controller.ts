import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Param,
	Post,
	Query,
	Req,
	UseGuards
} from '@nestjs/common'
import { CreateTransactionReviewRequestDto } from './dto/create-transaction-review-request.dto'
import { TransactionReviewService } from './transaction-review.service'
import { AuthGuard } from '../../module/AuthGuard/auth-guard.service'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { UserRole } from '../user/persistance/user.entity'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { GetAllRestaurantTransactionReviewsRequestDto } from './dto/get-all-restaurant-transaction-reviews-request.dto'

@Controller('reviews')
export class TransactionReviewController {
	constructor(private readonly transactionReviewService: TransactionReviewService) {}

	@Post('')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async createTransactionReview(
		@Req() req: GuardedRequestDto,
		@Body() data: CreateTransactionReviewRequestDto
	) {
		if (!req.user.customerData) {
			throw new ForbiddenException('User bukan customer')
		}
		return this.transactionReviewService.createTransactionReview(
			req.user.customerData,
			data
		)
	}

	@Get('restaurants/:restaurantId')
	async getRestaurantTransactionReviews(@Param('restaurantId') restaurantId: string, @Query() data: GetAllRestaurantTransactionReviewsRequestDto) {
		return this.transactionReviewService.getAllReviewByRestaurantId(restaurantId, data)
	}

	@Get('customers/:customerId')
	async getCustomerTransactionReviews(@Param('customerId') customerId: string) {
		return this.transactionReviewService.getAllReviewByCustomerId(customerId)
	}
	
	@Get('transactions/:transactionId')
	async getTransactionReview(@Param('transactionId') transactionId: string) {
		return this.transactionReviewService.getReviewByTransactionId(transactionId)
	}
}
