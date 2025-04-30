enum RestaurantVerificationStatus {
	UNVERIFIED = 'unverified',
	VERIFIED = 'verified',
	REJECTED = 'rejected'
}

const restaurantVerificationStatusMap = {
	reject: RestaurantVerificationStatus.REJECTED,
	approve: RestaurantVerificationStatus.VERIFIED,
	unverified: RestaurantVerificationStatus.UNVERIFIED
}

export { RestaurantVerificationStatus, restaurantVerificationStatusMap }
