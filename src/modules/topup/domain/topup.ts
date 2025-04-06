export class Topup {
	id: string
	customerId: string
	transactionId?: string
	amount: number
	status: string
	paymentType?: string
	settlementTime?: Date
	snapToken?: string
	snapRedirectUrl?: string
	createdAt: Date
}
