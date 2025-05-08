import { TimeScale } from '../enums/time-scale.enum'

function isSameDate(firstDate: Date, secondDate: Date) {
	return (
		firstDate.getFullYear() === secondDate.getFullYear() &&
		firstDate.getMonth() === secondDate.getMonth() &&
		firstDate.getDate() === secondDate.getDate()
	)
}

function isSameWeek(firstDate: Date, secondDate: Date) {
	const first = new Date(firstDate)
	const second = new Date(secondDate)

	const firstDay = first.getDay()
	const secondDay = second.getDay()

	const diff = Math.abs(first.getTime() - second.getTime())
	const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
	console.log(firstDay, secondDay)
	console.log(diffDays < 7)
	return diffDays < 7
}

function isSameMonth(firstDate: Date, secondDate: Date) {
	return (
		firstDate.getFullYear() === secondDate.getFullYear() &&
		firstDate.getMonth() === secondDate.getMonth()
	)
}

function isDateInScaleRange(firstDate: Date, secondDate: Date, scale: TimeScale) {
	if (scale === TimeScale.DAY) {
		return isSameDate(firstDate, secondDate)
	} else if (scale === TimeScale.WEEK) {
		return isSameWeek(firstDate, secondDate)
	} else {
		return isSameMonth(firstDate, secondDate)
	}
}

function getDatesBetween(startDate: Date, endDate: Date, scale: TimeScale): Date[] {
	const dates: Date[] = []
	const start = new Date(startDate)
	const end = new Date(endDate)

	if (start > end) {
		return []
	}

	if (scale === TimeScale.DAY) {
		const current = new Date(start)
		while (new Date(current.getDate() + 1) <= new Date(end.getDate() - 1)) {
			dates.push(new Date(current))
			current.setDate(current.getDate() + 1)
		}
	} else if (scale === TimeScale.WEEK) {
		const current = new Date(start)
		current.setDate(current.getDate() - current.getDay() + 1)

		while (new Date(current.getDate() + 7) <= new Date(end.getDate() - 7)) {
			dates.push(new Date(current))
			current.setDate(current.getDate() + 7)
		}
	} else if (scale === TimeScale.MONTH) {
		const current = new Date(start.getFullYear(), start.getMonth(), 1)

		while (new Date(current.getDate() + 30) <= new Date(end.getDate() - 30)) {
			dates.push(new Date(current))
			current.setMonth(current.getMonth() + 1)
		}
	}

	return dates
}

export { isSameDate, isSameWeek, isSameMonth, isDateInScaleRange, getDatesBetween }
