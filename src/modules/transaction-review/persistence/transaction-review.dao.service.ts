import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { TransactionReviewEntity } from './transaction-review.entity'
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql'
import { createTransactionReviewDto } from './dto/create-transaction-review.dto'
import { populate } from 'dotenv'

@Injectable()
export class TransactionReviewDaoService {
	constructor(
		@InjectRepository(TransactionReviewEntity)
		private readonly transactionReviewRepository: EntityRepository<TransactionReviewEntity>
	) {}

	async createTransactionReview(data: createTransactionReviewDto) {
		const transactionReview = this.transactionReviewRepository.create({
			transaction: data.transactionId,
			rating: data.rating,
			review: data.review
		})

		return transactionReview
	}

	async findTransactionReviewById(id: string) {
		const result = this.transactionReviewRepository.findOne(
			{ id },
			{
				populate: [
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes'
				]
			}
		)
		return result
	}

	async getReviewByTransactionId(transactionId: string) {
		const result = this.transactionReviewRepository.findOne(
			{
				transaction: { id: transactionId }
			},
			{
				populate: [
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes'
				]
			}
		)

		return result
	}

	async getReviewByCustomerId(customerId: string) {
		const result = this.transactionReviewRepository.find(
			{ transaction: { customer: { id: customerId } } },
			{
				populate: [
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes'
				]
			}
		)

		return result
	}

	async getReviewByRestaurantId(restaurantId: string, rating: number) {
		let filter: FilterQuery<TransactionReviewEntity> = {
			transaction: { restaurant: { id: restaurantId } }
		}
		if (rating) {
			filter.rating = rating
		}
		const result = this.transactionReviewRepository.find(
			filter,
			{
				populate: [
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes'
				]
			}
		)

		return result
	}
}
