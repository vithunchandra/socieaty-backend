enum FoodOrderStatus {
	PENDING = 'pending',
	REJECTED = 'rejected',
	PREPARING = 'preparing',
	READY = 'ready',
	COMPLETED = 'completed'
}

const foodOrderStatusMap = {
	pending: FoodOrderStatus.PENDING,
	rejected: FoodOrderStatus.REJECTED,
	preparing: FoodOrderStatus.PREPARING,
	ready: FoodOrderStatus.READY,
	completed: FoodOrderStatus.COMPLETED
}

enum FoodOrderSortBy {
	CREATED_AT = 'createdAt',
	FINISHED_AT = 'finishedAt',
}

const foodOrderSortByMap = {
	createdAt: FoodOrderSortBy.CREATED_AT,
	finishedAt: FoodOrderSortBy.FINISHED_AT,
}

export { FoodOrderStatus, FoodOrderSortBy, foodOrderStatusMap, foodOrderSortByMap }
