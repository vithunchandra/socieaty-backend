import { UserMapper } from '../../user/domain/user.mapper'
import { TransactionReviewEntity } from '../persistence/transaction-review.entity'
import { TransactionReview } from './transaction-review'

export class TransactionReviewMapper {
	static toDomain(raw: TransactionReviewEntity | null): TransactionReview | null {
		if (!raw) return null
		const review = new TransactionReview()
		review.id = raw.id
		review.transactionId = raw.transaction.id
		review.rating = raw.rating
		review.review = raw.review
		review.reviewer = UserMapper.fromCustomerToDomain(raw.transaction.customer)
		review.restaurant = UserMapper.fromRestaurantToDomain(raw.transaction.restaurant)
		review.createdAt = raw.createdAt
		review.updatedAt = raw.updatedAt
		return review
	}
}
