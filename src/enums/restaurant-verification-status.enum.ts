enum RestaurantVerificationStatus {
	UNVERIFIED = 'unverified',
	VERIFIED = 'verified',
	REJECTED = 'rejected'
}

const restaurantVerificationStatusMap = {
	rejected: RestaurantVerificationStatus.REJECTED,
	verified: RestaurantVerificationStatus.VERIFIED,
	unverified: RestaurantVerificationStatus.UNVERIFIED
}

export { RestaurantVerificationStatus, restaurantVerificationStatusMap }
