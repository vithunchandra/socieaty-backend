export enum TransactionStatus {
	PENDING = 'pending',
	REJECTED = 'rejected',
	PREPARING = 'preparing',
	READY = 'ready',
	COMPLETED = 'completed',
}

export enum TransactionPaymentType {
	BANK_TRANSFER = 'bank_transfer',
	E_WALLET = 'e-wallet'
}

export enum TransactionServiceType {
	FOOD_ORDER = 'food_order',
	RESERVATION = 'reservation'
}
