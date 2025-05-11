import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { TransactionDaoService } from './persistence/transaction.dao.service'
import {
	TransactionServiceType,
	TransactionSortBy,
	TransactionStatus
} from '../../enums/transaction.enum'
import { EntityManager } from '@mikro-orm/postgresql'
import { FoodOrderTransactionGateway } from '../food-order-transaction/food-order-transaction.gateway'

import { TransactionEntity } from './persistence/transaction.entity'
import { CreateTransactionDto } from './persistence/dto/create-transaction.dto'
import { PaginateTransactionsRequestQueryDto } from './dto/paginate-transactions-request-query.dto'
import { UserEntity, UserRole } from '../user/persistance/user.entity'
import { TransactionMapper } from './domain/transaction.mapper'
import { PaginationDto } from '../../dto/pagination.dto'
import { GetTransactionsInsightRequestQueryDto } from './dto/get-transactions-insight-request-query.dto'
import { GetTransactionsChartDataRequestDto } from './dto/get-transactions-chart-data-request.dto'
import { SortOrder } from '../../enums/sort-order.enum'
import { TimeScale } from '../../enums/time-scale.enum'
import { isDateInScaleRange, isSameDate, isSameWeek } from '../../utils/date.utils'
import { TransactionChart } from './domain/transaction-chart'
import { TransactionInsight } from './domain/transaction-insight'

@Injectable()
export class TransactionService {
	constructor(
		private readonly transactionDaoService: TransactionDaoService,
		@Inject(forwardRef(() => FoodOrderTransactionGateway))
		private readonly em: EntityManager
	) {}

	createTransaction(dto: CreateTransactionDto) {
		dto.customer.wallet -= dto.grossAmount
		const transaction = this.transactionDaoService.createTransaction(dto)
		return transaction
	}

	async refundTransaction(transaction: TransactionEntity, refundAmount: number) {
		if (transaction.status !== TransactionStatus.ONGOING) {
			throw new BadRequestException('Transaction is not ongoing')
		}
		if (refundAmount > transaction.grossAmount - transaction.serviceFee) {
			throw new BadRequestException('Refund amount is greater than the transaction amount')
		}
		if (refundAmount < 0) {
			throw new BadRequestException('Refund amount is less than 0')
		}
		transaction.refundAmount = refundAmount
		transaction.customer.wallet += refundAmount
		transaction.restaurant.wallet += transaction.netAmount - refundAmount
		transaction.status = TransactionStatus.REFUNDED
		transaction.finishedAt = new Date()
		return transaction
	}

	async failTransaction(transaction: TransactionEntity) {
		if (transaction.status !== TransactionStatus.ONGOING) {
			throw new BadRequestException('Transaction is not ongoing')
		}
		transaction.status = TransactionStatus.FAILED
		transaction.refundAmount = transaction.grossAmount
		transaction.customer.wallet += transaction.grossAmount
		transaction.finishedAt = new Date()
		return transaction
	}

	async finishTransaction(transaction: TransactionEntity) {
		if (transaction.status !== TransactionStatus.ONGOING) {
			throw new BadRequestException('Transaction is not ongoing')
		}
		transaction.status = TransactionStatus.SUCCESS
		transaction.restaurant.wallet += transaction.netAmount
		transaction.finishedAt = new Date()
		return transaction
	}

	async paginateTransactions(user: UserEntity, query: PaginateTransactionsRequestQueryDto) {
		if (
			user.role !== UserRole.ADMIN &&
			(user.customerData?.id !== query.customerId ||
				user.restaurantData?.id !== query.restaurantId)
		) {
			throw new UnauthorizedException('You are not authorized to access this resource')
		}

		const { items, count } = await this.transactionDaoService.paginateTransactions(query)
		const pagination = PaginationDto.createPaginationDto(
			count,
			query.paginationQuery.pageSize,
			query.paginationQuery.page
		)

		return {
			items: items.map((item) => TransactionMapper.toDomain(item)),
			pagination
		}
	}

	async getTransactionsInsight(user: UserEntity, query: GetTransactionsInsightRequestQueryDto) {
		if (user.role !== UserRole.ADMIN && user.restaurantData?.id !== query.restaurantId) {
			throw new UnauthorizedException('You are not authorized to access this resource')
		}

		console.log(query)

		const transactions = await this.transactionDaoService.findAllTransactions({
			...query,
			sortBy: TransactionSortBy.CREATED_AT,
			sortOrder: SortOrder.ASC
		})

		let totalIncome = 0
		let totalFailedTransactions = 0
		let totalSuccessTransactions = 0
		let totalFoodOrderTransactions = 0
		let totalReservationTransactions = 0

		for (const transaction of transactions) {
			if (transaction.status === TransactionStatus.SUCCESS) {
				totalSuccessTransactions++
				if (user.role === UserRole.RESTAURANT) {
					totalIncome += transaction.netAmount
				} else if (user.role === UserRole.ADMIN) {
					totalIncome += transaction.serviceFee
				}
			}
			if (transaction.status === TransactionStatus.FAILED) {
				totalFailedTransactions++
			}
			if (transaction.serviceType === TransactionServiceType.FOOD_ORDER) {
				totalFoodOrderTransactions++
			}
			if (transaction.serviceType === TransactionServiceType.RESERVATION) {
				totalReservationTransactions++
			}
		}

		return {
			transactionInsight: new TransactionInsight(
				totalIncome,
				totalFailedTransactions,
				totalSuccessTransactions,
				totalFoodOrderTransactions,
				totalReservationTransactions
			)
		}
	}

	async getTransactionsChartData(user: UserEntity, query: GetTransactionsChartDataRequestDto) {
		if (user.role !== UserRole.ADMIN && user.restaurantData?.id !== query.restaurantId) {
			throw new UnauthorizedException('You are not authorized to access this resource')
		}

		const transactions = await this.transactionDaoService.findAllTransactions({
			...query,
			status: [TransactionStatus.SUCCESS],
			sortBy: TransactionSortBy.CREATED_AT,
			sortOrder: SortOrder.ASC
		})

		if (transactions.length === 0) {
			return { chartData: [] }
		}

		const startDate = query.rangeStartDate
			? new Date(query.rangeStartDate)
			: transactions[0].createdAt
		const endDate = query.rangeEndDate
			? new Date(query.rangeEndDate)
			: transactions[transactions.length - 1].createdAt

		const allDates: Date[] = []
		const current = new Date(startDate)

		while (current <= endDate) {
			allDates.push(new Date(current))

			if (query.timeScale === TimeScale.DAY) {
				current.setDate(current.getDate() + 1)
			} else if (query.timeScale === TimeScale.WEEK) {
				current.setDate(current.getDate() + 7)
			} else if (query.timeScale === TimeScale.MONTH) {
				current.setMonth(current.getMonth() + 1)
			}
		}

		const dateMap = new Map<
			string,
			{ totalIncome: number; totalTransactions: number; date: Date }
		>()

		allDates.forEach((date) => {
			let dateKey: string

			if (query.timeScale === TimeScale.DAY) {
				dateKey = date.toISOString().split('T')[0]
			} else if (query.timeScale === TimeScale.WEEK) {
				// Find the start of the week
				const weekStart = new Date(date)
				const day = weekStart.getUTCDay()
				weekStart.setUTCDate(weekStart.getUTCDate() - day)
				dateKey = weekStart.toISOString().split('T')[0]
			} else {
				// TimeScale.MONTH
				dateKey = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-01`
			}

			dateMap.set(dateKey, { totalIncome: 0, totalTransactions: 0, date: new Date(date) })
		})

		for (const transaction of transactions) {
			const transactionDate = new Date(transaction.createdAt)
			let dateKey: string

			if (query.timeScale === TimeScale.DAY) {
				dateKey = transactionDate.toISOString().split('T')[0]
			} else if (query.timeScale === TimeScale.WEEK) {
				const weekStart = new Date(transactionDate)
				const day = weekStart.getUTCDay()
				weekStart.setUTCDate(weekStart.getUTCDate() - day)
				dateKey = weekStart.toISOString().split('T')[0]
			} else {
				dateKey = `${transactionDate.getUTCFullYear()}-${(transactionDate.getUTCMonth() + 1).toString().padStart(2, '0')}-01`
			}

			if (dateMap.has(dateKey)) {
				const data = dateMap.get(dateKey)!
				data.totalTransactions++

				if (user.role === UserRole.ADMIN) {
					data.totalIncome += transaction.serviceFee
				} else {
					data.totalIncome += transaction.netAmount
				}
			}
		}

		const chartData = Array.from(dateMap.values()).map(
			(data) =>
				new TransactionChart(
					data.date,
					data.totalIncome,
					data.totalTransactions,
					query.timeScale
				)
		)

		chartData.sort((a, b) => a.date.getTime() - b.date.getTime())

		return { chartData }
	}
}
