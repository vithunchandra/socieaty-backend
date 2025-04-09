import { TransformFnParams } from 'class-transformer'
import {
	reservationSortByMap,
	ReservationStatus,
	reservationStatusMap
} from '../enums/reservation.enum'
import { SortOrder, sortOrderMap } from '../enums/sort-order.enum'
import { foodOrderSortByMap, foodOrderStatusMap } from '../enums/food-order.enum'
import { fraudStatusMap, paymentStatusMap } from '../enums/topup.enum'
import { userRoleMap } from '../modules/user/persistance/User.entity'

function fieldToDate(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return new Date(data.value)
}

function fieldToString(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return data.value
}

function fieldToNumber(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return Number(data.value)
}

function fieldToReservationStatus(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return reservationStatusMap[data.value]
}

function fieldToReservationSortBy(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return reservationSortByMap[data.value]
}

function fieldToSortOrder(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return sortOrderMap[data.value]
}

function fieldToFoodOrderStatus(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return foodOrderStatusMap[data.value]
}

function fieldToFoodOrderSortBy(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return foodOrderSortByMap[data.value]
}

function fieldToPaymentStatus(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return paymentStatusMap[data.value]
}

function fieldToFraudStatus(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return fraudStatusMap[data.value]
}

function fieldToUserRole(data: TransformFnParams) {
	if (data.value === null || (data.value as String) === '') return undefined
	return userRoleMap[data.value]
}

export {
	fieldToDate,
	fieldToString,
	fieldToNumber,
	fieldToReservationStatus,
	fieldToReservationSortBy,
	fieldToSortOrder,
	fieldToFoodOrderStatus,
	fieldToFoodOrderSortBy,
	fieldToPaymentStatus,
	fieldToFraudStatus,
	fieldToUserRole
}
