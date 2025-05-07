enum TransactionStatus {
	SUCCESS = 'success',
	FAILED = 'failed',
	ONGOING = 'ongoing',
	REFUNDED = 'refunded'
}

const transactionStatusMap = {
	success: TransactionStatus.SUCCESS,
	failed: TransactionStatus.FAILED,
	ongoing: TransactionStatus.ONGOING,
	refunded: TransactionStatus.REFUNDED
}

enum TransactionPaymentType {
	BANK_TRANSFER = 'bank_transfer',
	E_WALLET = 'e-wallet'
}

const transactionPaymentTypeMap = {
	bankTransfer: TransactionPaymentType.BANK_TRANSFER,
	eWallet: TransactionPaymentType.E_WALLET
}

enum TransactionServiceType {
	FOOD_ORDER = 'food_order',
	RESERVATION = 'reservation'
}

const transactionServiceTypeMap = {
	foodOrder: TransactionServiceType.FOOD_ORDER,
	reservation: TransactionServiceType.RESERVATION
}

enum TransactionSortBy {
	CREATED_AT = 'createdAt',
	FINISHED_AT = 'finishedAt',
	GROSS_AMOUNT = 'grossAmount'
}

const transactionSortByMap = {
	createdAt: TransactionSortBy.CREATED_AT,
	finishedAt: TransactionSortBy.FINISHED_AT,
	grossAmount: TransactionSortBy.GROSS_AMOUNT
}

export {
	TransactionSortBy,
	TransactionStatus,
	TransactionServiceType,
	TransactionPaymentType,
	transactionSortByMap,
	transactionStatusMap,
	transactionPaymentTypeMap,
	transactionServiceTypeMap
}
