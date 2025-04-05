

export enum TransactionStatus {
	SUCCESS = 'success',
	FAILED = 'failed',
	ONGOING = 'ongoing',
	REFUNDED = 'refunded'
}

export enum TransactionPaymentType {
	BANK_TRANSFER = 'bank_transfer',
	E_WALLET = 'e-wallet'
}

export enum TransactionServiceType {
	FOOD_ORDER = 'food_order',
	RESERVATION = 'reservation'
}
