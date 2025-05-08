import { TimeScale } from '../../../enums/time-scale.enum'

class TransactionChart {
	date: Date
	totalIncome: number
	title: string
	totalTransactions: number

	constructor(date: Date, totalIncome: number, totalTransactions: number, timeScale: TimeScale) {
		this.date = date
		this.totalIncome = totalIncome
		this.totalTransactions = totalTransactions

		if (timeScale === TimeScale.MONTH) {
			this.title = date.toLocaleDateString('en-US', { month: 'short' })
		} else {
			const day = date.getDate()
			const month = date.toLocaleDateString('en-US', { month: 'short' })
			this.title = `${day} ${month}`
		}
	}
}

export { TransactionChart }
