enum TopupStatus {
	PENDING = 'pending',
	SUCCESS = 'success',
	FAILED = 'failed',
	EXPIRED = 'expired'
}

enum PaymentStatus {
	CAPTURE = 'capture',
	SETTLEMENT = 'settlement',
	PENDING = 'pending',
	DENY = 'deny',
	CANCEL = 'cancel',
	EXPIRE = 'expire',
	FAILURE = 'failure',
	REFUND = 'refund',
	PARTIAL_REFUND = 'partial_refund',
	AUTHORIZE = 'authorize'
}

const paymentStatusMap = {
	capture: PaymentStatus.CAPTURE,
	settlement: PaymentStatus.SETTLEMENT,
	pending: PaymentStatus.PENDING,
	deny: PaymentStatus.DENY,
	cancel: PaymentStatus.CANCEL,
	expire: PaymentStatus.EXPIRE,
	failure: PaymentStatus.FAILURE,
	refund: PaymentStatus.REFUND,
	partial_refund: PaymentStatus.PARTIAL_REFUND,
	authorize: PaymentStatus.AUTHORIZE
}

enum FraudStatus {
	ACCEPT = 'accept',
	DENY = 'deny',
}

const fraudStatusMap = {
	accept: FraudStatus.ACCEPT,
	deny: FraudStatus.DENY
}




export { paymentStatusMap, TopupStatus, PaymentStatus, FraudStatus, fraudStatusMap }
