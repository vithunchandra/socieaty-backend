export class TransactionInsight {
    totalIncome: number
    totalFailedTransactions: number
    totalSuccessTransactions: number
    totalFoodOrderTransactions: number
    totalReservationTransactions: number

    constructor(
        totalIncome: number,
        totalFailedTransactions: number,
        totalSuccessTransactions: number,
		totalFoodOrderTransactions: number,
		totalReservationTransactions: number
	) {
		this.totalIncome = totalIncome
		this.totalFailedTransactions = totalFailedTransactions
		this.totalSuccessTransactions = totalSuccessTransactions
		this.totalFoodOrderTransactions = totalFoodOrderTransactions
		this.totalReservationTransactions = totalReservationTransactions
	}
}
