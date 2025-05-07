enum TimeScale {
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month'
}

const timeScaleMap = {
	day: TimeScale.DAY,
	week: TimeScale.WEEK,
	month: TimeScale.MONTH
}

export { TimeScale, timeScaleMap }
