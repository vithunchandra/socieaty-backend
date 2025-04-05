enum ReservationStatus {
	REJECTED = 'rejected',
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	DINING = 'dining',
	CANCELED = 'canceled',
	COMPLETED = 'completed'
}

const reservationStatusMap = {
	rejected: ReservationStatus.REJECTED,
	pending: ReservationStatus.PENDING,
	confirmed: ReservationStatus.CONFIRMED,
	dining: ReservationStatus.DINING,
	canceled: ReservationStatus.CANCELED,
	completed: ReservationStatus.COMPLETED
}

enum ReservationSortBy {
	RESERVATION_TIME = 'reservationTime',
	CREATED_AT = 'createdAt',
	FINISHED_AT = 'finishedAt'
}

const reservationSortByMap = {
	reservationTime: ReservationSortBy.RESERVATION_TIME,
	createdAt: ReservationSortBy.CREATED_AT,
	finishedAt: ReservationSortBy.FINISHED_AT
}

export { reservationStatusMap, reservationSortByMap, ReservationStatus, ReservationSortBy }
