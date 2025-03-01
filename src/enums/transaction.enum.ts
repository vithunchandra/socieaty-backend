export enum TransactionStatus {
    CONFIRMING = 'confirming',
    PENDING = 'pending',
    PROCESS = 'process',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum TransactionPaymentType {
    BANK_TRANSFER = 'bank_transfer',
    E_WALLET = 'e-wallet',
}

export enum TransactionServiceType {
    FOOD_ORDER = 'food_order',
    RESERVATION = 'reservation',
}